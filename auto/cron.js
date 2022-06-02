const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const database = require("../models");
const Actas = database.Actas;
const Actas_req = database.Actas_req;


exports.corte = () => {
    cron.schedule('59 6 * * 6', () => {
        corteSemanal();
    }, { scheduled: true, timezone: 'America/Mexico_City' })

}


function corteSemanal(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;
    Actas.update({corte: today}, {where: {corte: null}}).then(data => {
        if(data == 1){
            console.log("Corte Realizado");
        }
        else{
            console.log("No hay actas!");
        }   
    }).catch(err => {
        console.log(err);
    });


    Actas_req.update({corte: today}, {where: {corte: null}}).then(data => {
        if(data == 1){
            console.log("Corte Realizado");
        }
        else{
            console.log("No hay actas!");
        }   
    }).catch(err => {
        console.log(err);
    });

}