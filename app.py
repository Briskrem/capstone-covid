from flask import Flask, jsonify, render_template, redirect, session, request, g
import requests
import requests.exceptions
from models import db, User, PieChart, connect_db
from forms import AddUser, Login
import json
CURR_USER_KEY = "curr_user"

app = Flask(__name__)



app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///covid_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECT'] = False

app.config['SECRET_KEY'] = '123456'
COVID_ACT_KEY='aed6be26a1674a1994ccbc0ff0d76224'

connect_db(app)



abbreviations={'AK':'Alaska','AL':'Alabama','AR':'Arkansas','AZ':'Arizona','CA':'California','CO':'Colorado','CT':'Connecticut','DC':'District of Columbia','DE':'Delaware','FL':'Florida',
    'GA':'Georgia','HI':'Hawaii','IA':'Iowa','ID':'Idaho','IL':'Illinois','IN':'Indiana','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','MA':'Massachusetts','MD':'Maryland','ME':'Maine',
    'MI':'Michigan','MN':'Minnesota','MO':'Missouri','MS':'Mississippi','MT':'Montana','NC':'North Carolina','ND':'North Dakota','NE':'Nebraska','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico',
    'NV':'Nevada','NY':'New York','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas',
    'UT':'Utah','VA':'Virginia','VT':'Vermont','WA':'Washington','WI':'Wisconsin','WV':'West Virginia','WY':'Wyoming'
}
state_choices=[('AK','Alaska'),('AL','Alabama'),('AR','Arkansas'),('AZ','Arizona'),('CA','California'),('CO','Colorado'),('CT','Connecticut'),('DC','District of Columbia'),('DE','Delaware'),('FL','Florida'),
    ('GA','Georgia'),('HI','Hawaii'),('IA','Iowa'),('ID','Idaho'),('IL','Illinois'),('IN','Indiana'),('KS','Kansas'),('KY','Kentucky'),('LA','Louisiana'),('MA','Massachusetts'),('MD','Maryland'),('ME','Maine'),
    ('MI','Michigan'),('MN','Minnesota'),('MO','Missouri'),('MS','Mississippi'),('MT','Montana'),('NC','North Carolina'),('ND','North Dakota'),('NE','Nebraska'),('NH','New Hampshire'),('NJ','New Jersey'),('NM','New Mexico'),
    ('NV','Nevada'),('NY','New York'),('OH','Ohio'),('OK','Oklahoma'),('OR','Oregon'),('PA','Pennsylvania'),('RI','Rhode Island'),('SC','South Carolina'),('SD','South Dakota'),('TN','Tennessee'),('TX','Texas'),
    ('UT','Utah'),('VA','Virginia'),('VT','Vermont'),('WA','Washington'),('WI','Wisconsin'),('WV','West Virginia'),('WY','Wyoming')
]


@app.before_request
def add_user_to_g():
    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None

def serialize_states(CHARTS):
    print('yam yam')
    print(CHARTS)
    print(CHARTS[0])
    print(CHARTS[0].state1)
    arr = [{
        "state1": chart.state1,
        "state2": chart.state2,
        "state3": chart.state3,
        "state4": chart.state4,
        "state5": chart.state5
    } for chart in CHARTS]

    return arr
    # for chart in CHARTS:

    # return {
    #     "state1": chart.state1,
    #     "state2": chart.state2,
    #     "state3": chart.state3,
    #     "state4": chart.state4,
    #     "state5": chart.state5
    # }




@app.route('/')
def home():
    if not g.user:
        return redirect('/login')

    response = requests.get(f'https://api.covidactnow.org/v2/country/US.json?apiKey={COVID_ACT_KEY}')
    cases=response.json().get('annotations').get('cases').get('sources')[0]
    deaths=response.json().get('annotations').get('deaths').get('sources')[0]
    vaccinations=response.json().get('annotations').get('vaccinesDistributed').get('sources')[0]
    return render_template('home.html', cases=cases, deaths=deaths, vaccinations=vaccinations)


@app.route('/us/aggregate')
def US_aggregate_data():
    if not g.user:
        return redirect('/login')
    response = requests.get(f'https://api.covidactnow.org/v2/country/US.json?apiKey={COVID_ACT_KEY}')
    return response.json()

@app.route('/search/advanced')
def advanced_search():
    if not g.user:
        return redirect('/login')
    return render_template('advanced-search.html')


@app.route('/search/advanced/<state>')
def advanced_search_data(state):
    if not g.user:
        return redirect('/login')
    print(f'uuuuu{state}')
    for key,value in abbreviations.items():
        
        if state.lower() == value.lower():
            print(f'jjjjj{key}')
            try:
                state_info=requests.get(f'https://api.covidactnow.org/v2/state/{key}.json?apiKey={COVID_ACT_KEY}')
                
                state_info.raise_for_status()
            except requests.exceptions.RequestException as e:
                print(e)
                print('ghjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
                continue
        
            return state_info.json()
       
    else:
        error = 'invalid INPUT'
        return error

@app.route('/charts')
def charts():
    if not g.user:
        return redirect('/login')
    return render_template('charts.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = AddUser()
    form.state.choices = state_choices
    if form.validate_on_submit():
        user = User.register(
                username=form.username.data,
                password=form.password.data,
                first_name=form.first_name.data,
                last_name=form.last_name.data,
                email=form.email.data,
                image_url=form.image_url.data or User.image_url.default.arg,
                state=form.state.data
        )
        print(user)
        db.session.add(user)
        db.session.commit()
        # session['user_id'] = user.user.id
        return redirect('/')
    return render_template('register.html', form=form)


@app.route('/profile')
def profile():
    if not g.user:
        return redirect('/login')
    user=User.query.get(g.user.id)
    return render_template('profile.html', user=user)

@app.route('/profile/edit', methods=['GET', 'POST'])
def edit_profile():
    form = AddUser()
    user = User.query.get(g.user.id)
    # form.username.data = user.username

    # form.first_name.data = user.first_name
    # form.last_name.data = user.last_name
    # form.email.data = user.email
    # form.image_url.data = user.image_url
    form.state.choices = state_choices
    if form.validate_on_submit():
        user.username = form.username.data
        print(form.username.data)
        print('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        print(user.username)
        user.first_name = form.first_name.data
        print(form.first_name.data)
        print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        print(user.first_name)
        user.last_name = form.last_name.data
        user.email = form.email.data
        user.image_url = form.image_url.data
        user.state = form.state.data
        db.session.add(user)
        db.session.commit()
        return redirect('/profile')

    return render_template('edit-profile.html', form=form)


@app.route('/charts/user')
def user_charts():
    saved_array = []
    sub_array = []
    # charts=PieChart.query.filter_by(PieChart.user_id==g.user.id).all()
    charts=db.session.query(PieChart.state1,
                             PieChart.state2,
                             PieChart.state3,
                             PieChart.state4,
                             PieChart.state5).filter_by(user_id=g.user.id).all()
    print(f'uuuuuuuuuuuuuuu{charts}')
    charts = [list(chart) for chart in charts]
    print(charts)

    print('11111111111111111111111111111111111111111111111111111111111111111111111111111111111')

    for chart in charts:
        sub_array=[]
        for state in chart:
            state_info=requests.get(f'https://api.covidactnow.org/v2/state/{state}.json?apiKey={COVID_ACT_KEY}')
            sub_array.append(state_info.json())
        saved_array.append(sub_array) 
    # charts=serialize_states(charts)
    # state_info=requests.get(f'https://api.covidactnow.org/v2/state/TX.json?apiKey={COVID_ACT_KEY}')
    # print(state_info.text)
    # charts=serialize_states(state_info)
    # return jsonify(charts)
    return jsonify(saved_array)

@app.route('/charts/add', methods=['POST'])
def addChart():
    state1=request.json["state1"]
    state2=request.json["state2"]
    state3=request.json["state3"]
    state4=request.json["state4"]
    state5=request.json["state5"]
    new_pieChart = PieChart(user_id=g.user.id, state1=state1,state2=state2,state3=state3,state4=state4,state5=state5)
    db.session.add(new_pieChart)
    db.session.commit()
    return jsonify({'update': 'piechart added'})

@app.route('/charts/delete', methods=['GET', 'DELETE'])
def delete_chart():
    charts = PieChart.query.all()
    if request.method == 'GET':
        if len(charts) == 1:
            return jsonify({'result': 'yes'})
        else:
            return jsonify({'result':'no'})
    if request.method == 'DELETE':
        db.session.query(PieChart).delete()
        db.session.commit()
        return jsonify({'result': 'deleted'})

@app.route('/profile/delete')
def delete_profile():
    db.session.delete(g.user)
    db.session.commit()

    return redirect("/login")
@app.route('/login', methods=['GET', 'POST'])
def login():
    form=Login()
    if form.validate_on_submit():
        username=form.username.data
        password=form.password.data
        user=User.authenticate(username, password)
        if user:
            session[CURR_USER_KEY] = user.id
            return redirect('/')
        else:
            return redirect('/login')
    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    if g.user:
        del session[CURR_USER_KEY]
        return redirect('/login')