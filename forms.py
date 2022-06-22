
from flask_wtf import FlaskForm
from xxlimited import Str
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, SelectField, IntegerField
from wtforms.validators import InputRequired, length

class AddUser(FlaskForm):
    username =StringField('Username', validators=[InputRequired(), length(max=30)])
    password =PasswordField('Password', validators=[InputRequired()])
    email =EmailField('Email', validators=[InputRequired(), length(max=50)])
    first_name =StringField('First_name', validators=[InputRequired(), length(max=30)])
    last_name =StringField('Last_name', validators=[InputRequired(), length(max=30)])
    image_url =StringField('Image_url')
    state =SelectField('State', validators=[InputRequired()])

class Login(FlaskForm):
    username =StringField('Username', validators=[InputRequired(), length(max=30)])
    password =PasswordField('Password', validators=[InputRequired()])
    
