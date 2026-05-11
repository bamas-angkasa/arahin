from typing import List, Tuple
from urllib.parse import urlencode


def generate_google_maps_link(start: Tuple[float, float], stops: List[Tuple[float, float]]) -> str:
    """Generate Google Maps directions link for the route."""
    base_url = "https://www.google.com/maps/dir/"
    
    # Start point
    start_lat, start_lng = start
    waypoints = f"{start_lat},{start_lng}/"
    
    # Add stops
    for lat, lng in stops:
        waypoints += f"{lat},{lng}/"
    
    # Remove trailing slash
    waypoints = waypoints.rstrip('/')
    
    return base_url + waypoints


def split_route_for_google_maps(start: Tuple[float, float], stops: List[Tuple[float, float]], max_waypoints: int = 10) -> List[str]:
    """Split route into multiple Google Maps links if too many waypoints."""
    links = []
    
    if len(stops) <= max_waypoints:
        links.append(generate_google_maps_link(start, stops))
    else:
        # Split into chunks
        for i in range(0, len(stops), max_waypoints):
            chunk = stops[i:i + max_waypoints]
            links.append(generate_google_maps_link(start, chunk))
    
    return links