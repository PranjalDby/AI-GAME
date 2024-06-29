#!/usr/bin/env node
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';

// ------------------------------ OpenAI API ------------------------------

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

async function askGoogle(currentScene) {
    console.log(chalk.redBright(currentScene))

    //our-model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // user-response:
    const { action } = await inquirer.prompt({
        type: 'input',
        name: 'action',
        message: 'User: ',
    });
    const generationConfig = {
        stopSequences: ["red"],
        maxOutputTokens: 200,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
      };
    const chat = model.startChat(
        {
            history:[
                {
                    role:'user',
                    parts:[{text:action}],
                },
                {
                    role:'model',
                    parts:[{text:currentScene}]
                }
            ],
            generationConfig:generationConfig
        }
    );
    const chatResult = await chat.sendMessage(action);
    const response = await chatResult.response;
    return {response:response.text().trim().replace("*",""),Useraction:action};
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

async function askName() {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is your name?',
        default: 'Player'
    });
    console.log(`Hello ${name}`);

    return name;
}

//welcomes

// const p_name = await askName();

//start game

let currentScene = "You find yourself in the MALL inside the city , now overrun by the undead. The skyscrapers, once symbols of human achievement, are now crumbling. Zombies roams inside the MALL, their vacant eyes searching for prey. You're All alone, with dead silence surrounding you. You have to find a way to escape the MALL and reach the safe zone. You have to make the right choices to survive. Good luck!";

async function startGame() {
    while (true) {
       
        const res = await askGoogle(currentScene)
        console.log(`Response: ${chalk.yellow(res.response)}`);
        
        currentScene = res.response;
        const { continueGame } = await inquirer.prompt({
            type: 'confirm',
            name: 'continueGame',
            message: 'Do you want to continue the game?',
            default: true
        });

        if (!continueGame) {
            break;
        }
    }
}
startGame();