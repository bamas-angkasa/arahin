import haversine as hs
from typing import List, Tuple


def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two points using haversine formula."""
    return hs.haversine((lat1, lng1), (lat2, lng2))


def build_distance_matrix(locations: List[Tuple[float, float]]) -> List[List[float]]:
    """Build distance matrix for all locations."""
    n = len(locations)
    matrix = [[0.0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if i != j:
                lat1, lng1 = locations[i]
                lat2, lng2 = locations[j]
                matrix[i][j] = calculate_distance(lat1, lng1, lat2, lng2)
    
    return matrix