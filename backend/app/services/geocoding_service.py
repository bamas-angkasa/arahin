import asyncio
import json
from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass
from typing import Optional
from urllib.parse import urlencode
from urllib.request import Request, urlopen


@dataclass
class GeocodingResult:
    formatted_address: str
    lat: float
    lng: float
    source: str


@dataclass
class PlaceSuggestion:
    place_id: str
    description: str
    main_text: str
    secondary_text: str
    source: str


class GeocodingService(ABC):
    @abstractmethod
    async def geocode_address(self, address: str) -> Optional[GeocodingResult]:
        pass


class LocalGeocodingService(GeocodingService):
    places = {
        "alun alun": GeocodingResult("Alun-Alun Kota Malang, Jl. Merdeka Selatan, Malang", -7.9826, 112.6308, "local"),
        "alun-alun": GeocodingResult("Alun-Alun Kota Malang, Jl. Merdeka Selatan, Malang", -7.9826, 112.6308, "local"),
        "stasiun malang": GeocodingResult("Stasiun Malang Kota Baru, Jl. Trunojoyo, Malang", -7.9772, 112.6372, "local"),
        "brawijaya": GeocodingResult("Universitas Brawijaya, Jl. Veteran, Malang", -7.9525, 112.6139, "local"),
        "ub": GeocodingResult("Universitas Brawijaya, Jl. Veteran, Malang", -7.9525, 112.6139, "local"),
        "ijen": GeocodingResult("Jl. Besar Ijen, Oro-Oro Dowo, Malang", -7.9666, 112.6326, "local"),
        "soekarno hatta": GeocodingResult("Jl. Soekarno Hatta, Malang", -7.9466, 112.6026, "local"),
        "suhat": GeocodingResult("Jl. Soekarno Hatta, Malang", -7.9466, 112.6026, "local"),
        "dinoyo": GeocodingResult("Dinoyo, Lowokwaru, Malang", -7.9566, 112.6126, "local"),
        "gajayana": GeocodingResult("Jl. Gajayana, Dinoyo, Malang", -7.9566, 112.6126, "local"),
        "sawojajar": GeocodingResult("Sawojajar, Kedungkandang, Malang", -7.9762, 112.6612, "local"),
        "tlogomas": GeocodingResult("Tlogomas, Lowokwaru, Malang", -7.9292, 112.5989, "local"),
        "blimbing": GeocodingResult("Blimbing, Malang", -7.9392, 112.6376, "local"),
    }

    async def geocode_address(self, address: str) -> Optional[GeocodingResult]:
        query = address.lower().strip()
        for keyword, result in self.places.items():
            if keyword in query:
                return result
        return None

    async def autocomplete_address(self, address: str) -> list[PlaceSuggestion]:
        query = address.lower().strip()
        suggestions = []

        for keyword, result in self.places.items():
            if query in keyword or query in result.formatted_address.lower():
                main_text, _, secondary_text = result.formatted_address.partition(",")
                suggestions.append(
                    PlaceSuggestion(
                        place_id=f"local:{keyword}",
                        description=result.formatted_address,
                        main_text=main_text,
                        secondary_text=secondary_text.strip(),
                        source="local",
                    )
                )

        return suggestions[:5]

    async def geocode_place_id(self, place_id: str) -> Optional[GeocodingResult]:
        keyword = place_id.removeprefix("local:")
        return self.places.get(keyword)


class MockGeocodingService(LocalGeocodingService):
    pass


class GoogleGeocodingService(GeocodingService):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.local_service = LocalGeocodingService()

    def _fetch_google_result(self, address: str) -> Optional[GeocodingResult]:
        params = urlencode(
            {
                "address": address,
                "region": "id",
                "key": self.api_key,
            }
        )
        with urlopen(f"https://maps.googleapis.com/maps/api/geocode/json?{params}", timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))

        if payload.get("status") != "OK" or not payload.get("results"):
            return None

        first_result = payload["results"][0]
        location = first_result["geometry"]["location"]
        return GeocodingResult(
            formatted_address=first_result["formatted_address"],
            lat=location["lat"],
            lng=location["lng"],
            source="google",
        )

    def _fetch_google_reverse_result(self, lat: float, lng: float) -> Optional[GeocodingResult]:
        params = urlencode(
            {
                "latlng": f"{lat},{lng}",
                "result_type": "street_address|premise|route|point_of_interest",
                "key": self.api_key,
            }
        )
        with urlopen(f"https://maps.googleapis.com/maps/api/geocode/json?{params}", timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))

        if payload.get("status") != "OK" or not payload.get("results"):
            return None

        first_result = payload["results"][0]
        location = first_result["geometry"]["location"]
        return GeocodingResult(
            formatted_address=first_result["formatted_address"],
            lat=location["lat"],
            lng=location["lng"],
            source="google",
        )

    def _fetch_google_suggestions(self, address: str) -> list[PlaceSuggestion]:
        body = json.dumps(
            {
                "input": address,
                "includedRegionCodes": ["id"],
                "languageCode": "id",
                "locationBias": {
                    "circle": {
                        "center": {"latitude": -7.9666, "longitude": 112.6326},
                        "radius": 35000.0,
                    }
                },
            }
        ).encode("utf-8")
        request = Request(
            "https://places.googleapis.com/v1/places:autocomplete",
            data=body,
            headers={
                "Content-Type": "application/json",
                "X-Goog-Api-Key": self.api_key,
                "X-Goog-FieldMask": (
                    "suggestions.placePrediction.placeId,"
                    "suggestions.placePrediction.text.text,"
                    "suggestions.placePrediction.structuredFormat.mainText.text,"
                    "suggestions.placePrediction.structuredFormat.secondaryText.text"
                ),
            },
            method="POST",
        )

        with urlopen(request, timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))

        suggestions = []
        for suggestion in payload.get("suggestions", []):
            prediction = suggestion.get("placePrediction")
            if not prediction:
                continue

            text = prediction.get("text", {}).get("text", "")
            main_text = prediction.get("structuredFormat", {}).get("mainText", {}).get("text", text)
            secondary_text = prediction.get("structuredFormat", {}).get("secondaryText", {}).get("text", "")
            suggestions.append(
                PlaceSuggestion(
                    place_id=prediction["placeId"],
                    description=text,
                    main_text=main_text,
                    secondary_text=secondary_text,
                    source="google",
                )
            )

        return suggestions

    def _fetch_google_place_details(self, place_id: str) -> Optional[GeocodingResult]:
        request = Request(
            f"https://places.googleapis.com/v1/places/{place_id}",
            headers={
                "X-Goog-Api-Key": self.api_key,
                "X-Goog-FieldMask": "formattedAddress,location",
            },
            method="GET",
        )

        with urlopen(request, timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))

        location = payload.get("location")
        if not location:
            return None

        return GeocodingResult(
            formatted_address=payload.get("formattedAddress", ""),
            lat=location["latitude"],
            lng=location["longitude"],
            source="google",
        )

    async def geocode_address(self, address: str) -> Optional[GeocodingResult]:
        local_result = await self.local_service.geocode_address(address)
        if not self.api_key:
            return local_result

        try:
            google_result = await asyncio.to_thread(self._fetch_google_result, address)
            return google_result or local_result
        except Exception:
            return local_result

    async def reverse_geocode(self, lat: float, lng: float) -> GeocodingResult:
        fallback = GeocodingResult(
            formatted_address=f"Current location ({lat:.5f}, {lng:.5f})",
            lat=lat,
            lng=lng,
            source="browser",
        )
        if not self.api_key:
            return fallback

        try:
            google_result = await asyncio.to_thread(self._fetch_google_reverse_result, lat, lng)
            return google_result or fallback
        except Exception:
            return fallback

    async def autocomplete_address(self, address: str) -> list[PlaceSuggestion]:
        local_suggestions = await self.local_service.autocomplete_address(address)
        if not self.api_key:
            return local_suggestions

        try:
            google_suggestions = await asyncio.to_thread(self._fetch_google_suggestions, address)
            return google_suggestions or local_suggestions
        except Exception:
            return local_suggestions

    async def geocode_place_id(self, place_id: str) -> Optional[GeocodingResult]:
        if place_id.startswith("local:"):
            return await self.local_service.geocode_place_id(place_id)

        if not self.api_key:
            return None

        try:
            return await asyncio.to_thread(self._fetch_google_place_details, place_id)
        except Exception:
            return None


def geocoding_result_to_dict(result: GeocodingResult) -> dict:
    return asdict(result)


def place_suggestion_to_dict(suggestion: PlaceSuggestion) -> dict:
    return asdict(suggestion)
