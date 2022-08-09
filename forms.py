
from flask_wtf import FlaskForm
from xxlimited import Str
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, SelectField, IntegerField, FileField, SubmitField
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
    
class EditUser(FlaskForm):
    first_name =StringField('First_name', validators=[InputRequired(), length(max=30)])
    last_name =StringField('Last_name', validators=[InputRequired(), length(max=30)])
    email =EmailField('Email', validators=[InputRequired(), length(max=50)])
    # image_url =StringField('Image_url(OPTIONAL')
    image_url = FileField('Profile Pic')
    state =SelectField('State', validators=[InputRequired()])

class UploadFile(FlaskForm):
    file = FileField('FILE')
    submit = SubmitField('SUBMIT')