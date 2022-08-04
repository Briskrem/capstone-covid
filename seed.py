from models import db
from app import app

db.drop_all()
db.create_all()


# even if the database is deleted, just re-create the database, then do ipyton, %run app.py
# db.create_all()