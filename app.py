import datetime
import csv
import requests
from flask import Flask, render_template, jsonify, redirect, request
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
    xMin = db.Column(db.Integer, nullable=False) 
    xMax = db.Column(db.Integer, nullable=False) 
    yName = db.Column(db.String(32), nullable=False)
    yMin = db.Column(db.Integer, nullable=False) 
    yMax = db.Column(db.Integer, nullable=False) 
    createdTime = db.Column(db.DateTime(), default=datetime.datetime.now()) 
    
def readResults(token):
    results = []
    with open(f'results/{token}.csv', newline='') as csvfile:
        resultsReader = csv.reader(csvfile, delimiter=' ')
        for result in resultsReader:
            results.append(result)
    return results


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
    return render_template("access_survey.html", title=accessedSurvey.title, xName=accessedSurvey.xName, xMin=accessedSurvey.xMin, xMax=accessedSurvey.xMax, yName=accessedSurvey.yName, yMin=accessedSurvey.yMin, yMax=accessedSurvey.yMax)

@app.route("/create", methods=['GET', 'POST'])
def create_survey():
    if request.method == 'POST':
        if (request.form["adminPassword"] == ADMIN_PASSWORD):
            # collecting data
            creator = "Admin" # to come
            token = tubaerit_utils.generateToken(8)
            while (Surveys.query.filter_by(token=token).first()):
                token = tubaerit_utils.generateToken(8) # making sure the token isnt already used
            xMin = None
            xMax = None
            yMin = None
            yMax = None
            if (request.form['xMin']):
                xMin = request.form['xMin']
            if (request.form['xMax']):
                xMax = request.form['xMax']
            if (request.form['yMin']):
                yMin = request.form['yMin']
            if (request.form['xMax']):
                yMax = request.form['yMax']

            # making database entry
            newSurvey = Surveys(title=request.form["title"], creator=creator, token=token, xName=request.form["xName"], xMin=xMin, xMax=xMax, yName=request.form["yName"], yMin=yMin, yMax=yMax)
            db.session.add(newSurvey)
            db.session.commit()
            db.session.refresh(newSurvey)     
            return render_template("survey_created.html", token=token) 
        return render_template("create_survey.html", error="Falsches Passwort.")
    return render_template("create_survey.html")

@app.route("/results/<token>", methods=['GET', 'POST'])
def show_results(token):    
    # getting information about the survey
    accessedSurvey = Surveys.query.filter_by(token=token).first()
    # getting results
    gatheredData = readResults(token)
    return render_template("results_survey.html", title=accessedSurvey.title, xName=accessedSurvey.xName, xMin=accessedSurvey.xMin, xMax=accessedSurvey.xMax, yName=accessedSurvey.yName, yMin=accessedSurvey.yMin, yMax=accessedSurvey.yMax, data=jsonify(gatheredData), token=token)

@app.route('/update/<token>', methods=['GET'])
def updateResults(token):
    gatheredData = readResults(token)
    print(gatheredData)
    data = jsonify(gatheredData)
    print(data)
    # Return data as JSON response
    return data