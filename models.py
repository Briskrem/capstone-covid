from enum import unique
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import bcrypt
from flask_bcrypt import Bcrypt
from datetime import datetime
from sqlalchemy.orm import backref


db = SQLAlchemy()
bcrypt = Bcrypt()

def connect_db(app):
    db.app = app
    db.init_app(app)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    username = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    state = db.Column(db.Text,nullable=False)
    image_url = db.Column(db.Text,default='/static/pics/cherry.jpg')
    header_image_url = db.Column(db.Text, default='https://thestayathomechef.com/wp-content/uploads/2017/12/Most-Amazing-Chocolate-Cupcakes-1-small.jpg')
    time_stamp = db.Column(db.DateTime,nullable=False,default=datetime.utcnow(),)

    @classmethod
    def register(cls, first_name, last_name, username, password, email, state, image_url):
        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')
        # hashed = bcrypt.generate_password_hash(password)
        # hashed_utf8 = hashed.decode('utf8')
        return cls(username=username, password=hashed_pwd, email=email, first_name=first_name, last_name=last_name, state=state, image_url=image_url)
    
    @classmethod
    def authenticate(cls, username, password):
        print('ttttttttttttttrttttttttttttttttttt')
        user = User.query.filter_by(username=username).first()
        if user:
            print(user.username)
            print(user.password)
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return False

class PieChart(db.Model):
    __tablename__ = 'piecharts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    state1 = db.Column(db.Text)
    state2 = db.Column(db.Text)
    state3 = db.Column(db.Text)
    state4 = db.Column(db.Text)
    state5 = db.Column(db.Text)

    USER=db.relationship('User', backref=backref('PIECHARTS', cascade="all, delete-orphan"))