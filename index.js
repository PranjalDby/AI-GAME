#!/usr/bin/env node
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';

// ------------------------------ API ------------------------------

const __GOOGLE_API_KEY__ = ''
const genAI = new GoogleGenerativeAI(__GOOGLE_API_KEY__);
const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens:500,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
};
let actionHold = undefined;
let storyLine = undefined
let chat = undefined;
let startFlag = 0;
async function askGoogle() {

    //our-model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // user-response:
    if (currentScene == undefined) {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: `Choose Option`,
            choices: [
                'Let Survive The Zombies Apocalypse.',
            ]
        });
        console.log("Action ", action)
        actionHold = action
        console.log("Choose You're Scenario")
        currentScene = await inquirer.prompt({
            type: 'list',
            name: 'currentScene',
            message: `Choose Option`,
            choices: [
                'Nano-Zombies: The undead are infected by nanobots that constantly repair their decaying bodies, making them nearly indestructible.',
                'Cyber-Zombies: Advanced AI technology has taken control of human corpses, turning them into relentless killing machines.'
            ]
        });
        console.log("Current Scene = ",currentScene)
    }
    else{

        actionHold = await inquirer.prompt({
            type: 'input',
            name: 'actionHold',
            message: 'Enter Your Input:'
        });
        actionHold = actionHold.actionHold.split(',').map(item => item.trim());
    }
    console.log("actionHold = ", actionHold);
    if (startFlag == 0) {
        chat = await model.startChat(
            {
                history: [
                    {
                        role: 'user',
                        parts: [{ text: `"${actionHold}"` }],
                    },
                    {
                        role: 'model',
                        parts:[
                            {text:`'${currentScene}'`}
                        ]
                    },

                ],
                generationConfig: generationConfig
            }
        );
        startFlag = 1;
    }

    const chatResult = await chat.sendMessage(actionHold);
    const response = await chatResult.response;
    if (response.text() != undefined) {
        console.log(`\n Response:\n${chalk.yellow(response.text())}`);
    }
    const { continueGame } = await inquirer.prompt({
        type: 'confirm',
        name: 'continueGame',
        message: 'Do you want to continue the game?',
        default: true
    });

    if(!continueGame){
        return;
    }
}

// ------------------------------ CLI Interface ------------------------------
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow("Welcome to the Text-based AI GAME TOBA");
    await sleep();
    rainbowTitle.stop();
    console.log(`
        ${chalk.bgBlue('HOW TO PLAY')}
    `);
}

await welcome();



//start game

let currentScene = undefined;

async function startGame() {
    // while (true) {

    //     const res = await askGoogle(currentScene)
    //     console.log(`\n Response:\n${chalk.yellow(res.response)}`);

    //     currentScene = res.response;
    //     const { continueGame } = await inquirer.prompt({
    //         type: 'confirm',
    //         name: 'continueGame',
    //         message: 'Do you want to continue the game?',
    //         default: true
    //     });

    //     if (!continueGame) {
    //         break;
    //     }
    // }
    while (true) {
        await askGoogle()
    }

}
await startGame();