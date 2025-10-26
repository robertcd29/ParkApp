from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List
from datetime import datetime
import asyncio
import json

app = FastAPI()

# CORS pentru React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React + Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexiune PostgreSQL
def get_db_connection():
    return psycopg2.connect(
        dbname="smart_park",  # Numele bazei de date a Dariei
        user="postgres",         # Username-ul PostgreSQL al Dariei
        password="d",  # Parola PostgreSQL a Dariei
        host="192.168.56.1",    # IP-ul laptopului Dariei (ex: 192.168.1.105)
        port="5432",
        cursor_factory=RealDictCursor
    )


# Model de date
class ParkingSpot(BaseModel):
    id: int | None = None
    name: str
    latitude: float
    longitude: float
    is_occupied: bool | None = False
    empty_spots: int | None = 0
    occupied_spots: int | None = 0

# 📍 ENDPOINT 1: Obține toate locurile (REST normal)
@app.get("/spots")
def get_spots():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM parking_spots ORDER BY id;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

# 📍 ENDPOINT 2: Obține statistici
@app.get("/stats")
def get_stats():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            COUNT(*) as total_zones,
            SUM(empty_spots) as total_empty,
            SUM(occupied_spots) as total_occupied
        FROM parking_spots
    """)
    stats = cur.fetchone()
    cur.close()
    conn.close()
    return stats

# 📍 ENDPOINT 3: Actualizează un loc
@app.put("/spots/{spot_id}")
def update_spot(spot_id: int, spot: ParkingSpot):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """UPDATE parking_spots 
           SET is_occupied=%s, empty_spots=%s, occupied_spots=%s, last_update=%s 
           WHERE id=%s RETURNING *""",
        (spot.is_occupied, spot.empty_spots, spot.occupied_spots, datetime.now(), spot_id)
    )
    conn.commit()
    updated = cur.fetchone()
    cur.close()
    conn.close()
    return updated

# 🔴 WEBSOCKET pentru LIVE UPDATES
@app.websocket("/ws/parking")
async def websocket_parking(websocket: WebSocket):
    await websocket.accept()
    print("✅ Client conectat la WebSocket")
    
    try:
        while True:
            # Ia datele din DB
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("SELECT * FROM parking_spots ORDER BY id")
            rows = cur.fetchall()
            cur.close()
            conn.close()
            
            # Trimite la frontend
            await websocket.send_json(rows)
            
            # Update la fiecare 5 secunde
            await asyncio.sleep(5)
            
    except WebSocketDisconnect:
        print("Client deconectat")

# Health check
@app.get("/")
def read_root():
    return {"status": "FastAPI Running!", "endpoints": ["/spots", "/stats", "/ws/parking"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)