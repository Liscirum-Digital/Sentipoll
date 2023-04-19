import datetime
import csv
from flask import Flask, render_template, flash, redirect, request, url_for, send_from_directory, session, make_response
from flask_sqlalchemy import SQLAlchemy

import tubaerit_utils

ADMIN_PASSWORD = "test"

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tubaerit.db'

db = SQLAlchemy(app)
app.app_context().push()


class Surveys(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    creator = db.Column(db.String(64), nullable=False)
    token = db.Column(db.String(64), unique=True, nullable=False)
    xName = db.Column(db.String(32))
    yName = db.Column(db.String(32), nullable=False)
    createdTime = db.Column(db.DateTime(), default=datetime.datetime.now()) 
    

@app.route("/")
def start():
    return render_template("index.html")

@app.route("/access/<token>", methods=['GET', 'POST'])
def serve_survey(token):
    if request.method == 'POST':
        # writing results into file
        with open(f'results/{token}.csv', 'a', newline='') as csvfile:
            resultsWriter = csv.writer(csvfile, delimiter=' ',)
            resultsWriter.writerow([request.form['xInput'],  request.form['yInput']])
        return render_template("success.html")

    # returning page for data input
    accessedSurvey = Surveys.query.filter_by(token=token).first()
    xName = accessedSurvey.xName
    yName = accessedSurvey.yName
    title = accessedSurvey.title
    return render_template("access_survey.html", title=title, xName=xName, yName=yName)

@app.route("/create", methods=['GET', 'POST'])
def create_survey():
    if request.method == 'POST':
        if (request.form["adminPassword"] == ADMIN_PASSWORD):
            # collecting data
            title = request.form["title"]
            creator = "Admin" # to come
            token = tubaerit_utils.generateToken(64)
            xName = request.form["xName"]
            yName = request.form["yName"]
            # making database entry
            newSurvey = Surveys(title=title, creator=creator, token=token, xName=xName, yName=yName)
            db.session.add(newSurvey)
            db.session.commit()
            db.session.refresh(newSurvey)     
            return render_template("succes.html") 
        return render_template("create_survey.html", error="Falsches Passwort.")
    return render_template("create_survey.html")

@app.route("/results/<token>", methods=['GET', 'POST'])
def show_results(token):
    if request.method == 'POST':
        # writing results into file
        with open(f'results/{token}.csv', 'a', newline='') as csvfile:
            resultsWriter = csv.writer(csvfile, delimiter=' ',)
            resultsWriter.writerow([request.form['xInput'],  request.form['yInput']])
        return render_template("success.html")

    # returning page for data input
    accessedSurvey = Surveys.query.filter_by(token=token).first()
    xName = accessedSurvey.xName
    yName = accessedSurvey.yName
    title = accessedSurvey.title
    return render_template("survey_results.html", title=title, xName=xName, yName=yName)