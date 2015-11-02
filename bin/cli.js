#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const ui = require('cliui')();

const nicestInit = require('../tasks/init');
const nicestAdmin = require('../tasks/admin');
const nicestStart = require('../tasks/start');
const nicestStop = require('../tasks/stop');
const nicestDev = require('../tasks/dev');
const nicestDoc = require('../tasks/doc');
const nicestLint = require('../tasks/lint');

const command = process.argv.slice(2)[0];

const tasks = [
    nicestInit,
    nicestAdmin,
    nicestStart,
    nicestStop,
    nicestDev,
    nicestDoc,
    nicestLint
];

const task = _.find(tasks, _.matches({name: command}));

if (_.isUndefined(task)) {
    ui.div({
        text: chalk.bold('Nicest Command Line Interface'),
        padding: [1, 0, 1, 0]
    });
    ui.div({
        text: `${chalk.bold('usage:')} nicest <command>`,
        padding: [0, 0, 1, 0]
    });
    ui.div({
        text: chalk.bold('commands'),
        padding: [0, 0, 1, 0]
    });

    _.forEach(tasks, (task) => {
        ui.div(
            {
                text: task.name,
                padding: [0, 4, 0, 4]
            },
            {
                text: task.description,
                width: 60
            }
        );
    });

    console.log(ui.toString());
} else {
    task();
}
