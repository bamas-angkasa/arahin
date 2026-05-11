from abc import ABC, abstractmethod
from typing import Optional, Tuple


class GeocodingService(ABC):
    @abstractmethod
    async def geocode_address(self, address: str) -> Tuple[Optional[float], Optional[float]]:
        pass


class MockGeocodingService(GeocodingService):
    async def geocode_address(self, address: str) -> Tuple[Optional[float], Optional[float]]:
        # For MVP, return None to force manual lat/lng input
        return None, None


class GoogleGeocodingService(GeocodingService):
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def geocode_address(self, address: str) -> Tuple[Optional[float], Optional[float]]:
        # Placeholder for Google Maps Geocoding API
        # TODO: Implement actual geocoding
        return None, None