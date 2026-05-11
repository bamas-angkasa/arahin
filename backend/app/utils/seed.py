from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.delivery_plan import DeliveryPlan, DeliveryPlanStatus
from app.models.delivery_stop import DeliveryStop, DeliveryStopStatus
from app.core.security import get_password_hash
import secrets


DEMO_EMAIL = "demo@arahin.com"
DEMO_PASSWORD = "password123"


MALANG_DELIVERY_PLANS = [
    {
        "title": "Malang Random Chaos Delivery Route",
        "start_address": "Alun-Alun Kota Malang, Jl. Merdeka Selatan, Malang",
        "start_lat": -7.9826,
        "start_lng": 112.6308,
        "stops": [

            # Kabupaten Selatan
            {
                "recipient_name": "Putri Amelia",
                "phone": "081300000012",
                "raw_address": "Jl. Raya Turen No. 88, Turen, Malang",
                "lat": -8.1687,
                "lng": 112.6824,
                "note": "Rumah cat biru",
                "priority": 3,
            },

            # Barat
            {
                "recipient_name": "Maya Lestari",
                "phone": "081300000004",
                "raw_address": "Jl. Joyosuko Metro No. 20, Merjosari, Malang",
                "lat": -7.9369,
                "lng": 112.5894,
                "note": "Cluster belakang",
                "priority": 2,
            },

            # Tengah
            {
                "recipient_name": "Sinta Dewi",
                "phone": "081300000006",
                "raw_address": "Jl. Semeru No. 25, Klojen, Malang",
                "lat": -7.9724,
                "lng": 112.6251,
                "note": "Dekat apotek",
                "priority": 1,
            },

            # Utara jauh
            {
                "recipient_name": "Dina Maharani",
                "phone": "081300000002",
                "raw_address": "Jl. Ahmad Yani No. 88, Lawang, Malang",
                "lat": -7.8355,
                "lng": 112.6971,
                "note": "Dekat SPBU",
                "priority": 2,
            },

            # Timur
            {
                "recipient_name": "Kevin Wijaya",
                "phone": "081300000007",
                "raw_address": "Jl. Danau Toba No. 5, Sawojajar, Malang",
                "lat": -7.9721,
                "lng": 112.6611,
                "note": "Cluster depan",
                "priority": 2,
            },

            # Selatan kota
            {
                "recipient_name": "Yoga Prasetyo",
                "phone": "081300000009",
                "raw_address": "Jl. Kolonel Sugiono No. 20, Gadang, Malang",
                "lat": -8.0018,
                "lng": 112.6299,
                "note": "Dekat pasar",
                "priority": 1,
            },

            # Kabupaten Barat
            {
                "recipient_name": "Fajar Hidayat",
                "phone": "081300000011",
                "raw_address": "Jl. Raya Kepanjen No. 15, Kepanjen, Malang",
                "lat": -8.1304,
                "lng": 112.5722,
                "note": "Samping alfamart",
                "priority": 1,
            },

            # Barat lagi
            {
                "recipient_name": "Rizky Pratama",
                "phone": "081300000003",
                "raw_address": "Jl. Raya Tlogomas No. 99, Tlogomas, Malang",
                "lat": -7.9385,
                "lng": 112.5970,
                "note": "Ruko merah",
                "priority": 1,
            },

            # Timur Selatan
            {
                "recipient_name": "Lina Kartika",
                "phone": "081300000008",
                "raw_address": "Jl. Ki Ageng Gribig No. 77, Kedungkandang, Malang",
                "lat": -7.9895,
                "lng": 112.6712,
                "note": "Rumah hijau",
                "priority": 3,
            },

            # Tengah lagi
            {
                "recipient_name": "Budi Santoso",
                "phone": "081300000005",
                "raw_address": "Jl. Ijen No. 10, Oro-Oro Dowo, Malang",
                "lat": -7.9666,
                "lng": 112.6326,
                "note": "Rumah putih",
                "priority": 1,
            },

            # Utara
            {
                "recipient_name": "Andi Saputra",
                "phone": "081300000001",
                "raw_address": "Jl. Raya Singosari No. 10, Singosari, Malang",
                "lat": -7.8921,
                "lng": 112.6655,
                "note": "Rumah pagar hitam",
                "priority": 1,
            },

            # Selatan timur
            {
                "recipient_name": "Nadia Putri",
                "phone": "081300000010",
                "raw_address": "Jl. Raya Cemorokandang No. 40, Kedungkandang, Malang",
                "lat": -8.0195,
                "lng": 112.6502,
                "note": "Gudang belakang",
                "priority": 2,
            },
        ],
    },
    {
        "title": "Malang Kota - Central Route",
        "start_address": "Alun-Alun Kota Malang, Jl. Merdeka Selatan, Malang",
        "start_lat": -7.9826,
        "start_lng": 112.6308,
        "stops": [
            {
                "recipient_name": "Budi Santoso",
                "phone": "08123456789",
                "raw_address": "Jl. Ijen No. 10, Oro-oro Dowo, Malang",
                "lat": -7.9666,
                "lng": 112.6326,
                "note": "Rumah pagar hitam",
                "priority": 1,
            },
            {
                "recipient_name": "Sinta Dewi",
                "phone": "081999888777",
                "raw_address": "Jl. Semeru No. 25, Klojen, Malang",
                "lat": -7.9724,
                "lng": 112.6251,
                "note": "Dekat apotek",
                "priority": 1,
            },
            {
                "recipient_name": "Agus Pratama",
                "phone": "081222333444",
                "raw_address": "Jl. Basuki Rahmat No. 45, Klojen, Malang",
                "lat": -7.9771,
                "lng": 112.6329,
                "note": "Ruko lantai 2",
                "priority": 2,
            },
            {
                "recipient_name": "Rina Lestari",
                "phone": "081777666555",
                "raw_address": "Jl. Kawi No. 18, Bareng, Malang",
                "lat": -7.9808,
                "lng": 112.6207,
                "note": "Titip resepsionis",
                "priority": 1,
            },
        ],
    },
    {
        "title": "Malang Utara - Lowokwaru Route",
        "start_address": "Universitas Brawijaya, Jl. Veteran, Malang",
        "start_lat": -7.9525,
        "start_lng": 112.6139,
        "stops": [
            {
                "recipient_name": "Ahmad Rahman",
                "phone": "081555666777",
                "raw_address": "Jl. Gajayana No. 15, Dinoyo, Malang",
                "lat": -7.9566,
                "lng": 112.6126,
                "note": "Apartemen lantai 5",
                "priority": 2,
            },
            {
                "recipient_name": "Maya Putri",
                "phone": "081333444555",
                "raw_address": "Jl. Soekarno Hatta No. 20, Lowokwaru, Malang",
                "lat": -7.9466,
                "lng": 112.6026,
                "note": "Titip satpam",
                "priority": 1,
            },
            {
                "recipient_name": "Doni Wijaya",
                "phone": "081888999000",
                "raw_address": "Jl. Candi Panggung No. 8, Mojolangu, Malang",
                "lat": -7.9327,
                "lng": 112.6243,
                "note": "Gang sebelah minimarket",
                "priority": 1,
            },
            {
                "recipient_name": "Lia Kartika",
                "phone": "08124681012",
                "raw_address": "Jl. Tlogomas No. 33, Lowokwaru, Malang",
                "lat": -7.9345,
                "lng": 112.5948,
                "note": "Rumah cat putih",
                "priority": 2,
            },
        ],
    },
    {
        "title": "Malang Timur - Sawojajar Route",
        "start_address": "Stasiun Malang Kota Baru, Jl. Trunojoyo, Malang",
        "start_lat": -7.9772,
        "start_lng": 112.6372,
        "stops": [
            {
                "recipient_name": "Fajar Nugroho",
                "phone": "08190908070",
                "raw_address": "Jl. Danau Toba No. 12, Sawojajar, Malang",
                "lat": -7.9723,
                "lng": 112.6604,
                "note": "Blok B",
                "priority": 1,
            },
            {
                "recipient_name": "Nadia Amalia",
                "phone": "081123123456",
                "raw_address": "Jl. Danau Bratan No. 7, Sawojajar, Malang",
                "lat": -7.9659,
                "lng": 112.6582,
                "note": "Samping warung bakso",
                "priority": 1,
            },
            {
                "recipient_name": "Teguh Saputra",
                "phone": "081432143214",
                "raw_address": "Jl. Sulfat No. 40, Purwantoro, Malang",
                "lat": -7.9596,
                "lng": 112.6462,
                "note": "Gudang belakang",
                "priority": 2,
            },
            {
                "recipient_name": "Citra Maharani",
                "phone": "08167676767",
                "raw_address": "Jl. Ki Ageng Gribig No. 22, Madyopuro, Malang",
                "lat": -7.9893,
                "lng": 112.6686,
                "note": "Hubungi sebelum sampai",
                "priority": 1,
            },
        ],
    },
]


def seed_database():
    db: Session = SessionLocal()

    try:
        user = db.query(User).filter(User.email == DEMO_EMAIL).first()
        if user:
            user.name = "Demo User"
            user.password_hash = get_password_hash(DEMO_PASSWORD)
        else:
            user = User(
                name="Demo User",
                email=DEMO_EMAIL,
                password_hash=get_password_hash(DEMO_PASSWORD),
            )
            db.add(user)
        db.commit()
        db.refresh(user)

        seeded_plans = []
        for plan_data in MALANG_DELIVERY_PLANS:
            plan = (
                db.query(DeliveryPlan)
                .filter(
                    DeliveryPlan.user_id == user.id,
                    DeliveryPlan.title == plan_data["title"],
                )
                .first()
            )

            if not plan:
                plan = DeliveryPlan(
                    user_id=user.id,
                    title=plan_data["title"],
                    start_address=plan_data["start_address"],
                    start_lat=plan_data["start_lat"],
                    start_lng=plan_data["start_lng"],
                    status=DeliveryPlanStatus.draft,
                    share_code=secrets.token_urlsafe(8),
                )
                db.add(plan)
                db.commit()
                db.refresh(plan)

            existing_stop_count = (
                db.query(DeliveryStop)
                .filter(DeliveryStop.delivery_plan_id == plan.id)
                .count()
            )
            if existing_stop_count == 0:
                for sequence, stop_data in enumerate(plan_data["stops"], start=1):
                    db.add(
                        DeliveryStop(
                            delivery_plan_id=plan.id,
                            recipient_name=stop_data["recipient_name"],
                            phone=stop_data["phone"],
                            raw_address=stop_data["raw_address"],
                            formatted_address=stop_data["raw_address"],
                            lat=stop_data["lat"],
                            lng=stop_data["lng"],
                            note=stop_data["note"],
                            priority=stop_data["priority"],
                            sequence_order=sequence,
                            status=DeliveryStopStatus.pending,
                        )
                    )
                db.commit()

            seeded_plans.append(plan)

        print("Sample data seeded successfully!")
        print(f"Demo user: {DEMO_EMAIL} / {DEMO_PASSWORD}")
        print(f"Delivery plans: {len(seeded_plans)}")
        print("Total Malang stops: 12")
        for plan in seeded_plans:
            print(f"- {plan.title}: {plan.share_code}")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
