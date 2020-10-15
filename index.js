const express = require('express');
const app = express();
const port = 3000;

const boardSize = { minX: 0, maxX: 5, minY: 0, maxY: 5 };
let isPlaced = false;
let currentPosition = { x: 0, y: 0, facing: 'NORTH' };

process.stdin.resume();
process.stdin.setEncoding('utf8');

const checkDirectionValidity = direction => {
    // List of valid locations
    const validDirections = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    // Provided direction in valid directions?
    if (validDirections.indexOf(direction) > -1) return direction;

    // Return null (for functions that return a reference type i.e. object its better to reutrn null instead of false when conditions are not met because false represents data)
    return null;
};

// Read user commands and parse them
const readCommand = input => {
    // Define command object
    let command = {
        type: null,
        x: null,
        y: null,
        facing: null,
    };

    // Get the type of command
    command.type = input.split(' ')[0].trim() || null;
    if (command.type === 'PLACE') {
        try {
            command.x = Number(input.split(' ')[1].split(',')[0].trim());
            command.y = Number(input.split(' ')[1].split(',')[1].trim());
            command.facing = checkDirectionValidity(input.split(' ')[1].split(',')[2].trim());
        } catch (error) {
            // Send error back for custom error messages
        }
    }
    // Return command data
    return command;
};

// Check if new placement is valid 
const isValidPlacement = ({ x, y, facing }) => {
    // Check validity of each placement parameter if not met return false
    if (x === null || y === null || facing === null || x > boardSize.maxX || x < boardSize.minX || y > boardSize.maxY || y < boardSize.minY) return false;

    // Conditions are met return true
    return true;
};

// Move the robot
const move = (currentPosition) => {
    switch(currentPosition.facing) {
        case 'NORTH': 
            if (currentPosition.y + 1 <= boardSize.maxY)
                currentPosition.y  = currentPosition.y + 1;
            break;
        case 'EAST': 
            if (currentPosition.x + 1 <= boardSize.maxX)
                currentPosition.x  = currentPosition.x + 1;
            break;
        case 'SOUTH': 
            if (currentPosition.y - 1 >= boardSize.minY)
                currentPosition.y = currentPosition.y - 1;
            break;
        case 'WEST': 
            if (currentPosition.x - 1 >= boardSize.minX)
                currentPosition.x = currentPosition.x - 1;
        default: 
            break;
    };

    return currentPosition;
};

const changeDirection = (currentPosition, direction) => {
    if (direction === 'LEFT') {
        switch(currentPosition.facing) {
            case 'NORTH': 
                currentPosition.facing = 'WEST';
                break;
            case 'EAST':
                currentPosition.facing = 'NORTH';
                break;
            case 'SOUTH': 
                currentPosition.facing = 'EAST';
                break;
            case 'WEST': 
                currentPosition.facing = 'SOUTH';
                break;
            default:
                break;
        }
    }

    if (direction === 'RIGHT') {
        switch(currentPosition.facing) {
            case 'NORTH': 
                currentPosition.facing = 'EAST';
                break;
            case 'EAST':
                currentPosition.facing = 'SOUTH';
                break;
            case 'SOUTH': 
                currentPosition.facing = 'WEST';
                break;
            case 'WEST': 
                currentPosition.facing = 'NORTH';
                break;
            default:
                break;
        }
    }

    return currentPosition;
};

process.stdin.on('data', (input) => {
    const command = readCommand(input);

    switch(command.type) {
        case 'PLACE':
            const x = command.x;
            const y = command.y;
            const facing = command.facing;
            // Check x, y, and facing validity
            if (isValidPlacement({ x, y, facing })) {
                currentPosition = {x, y, facing};
                isPlaced = true;
            } else {
                console.log('Invalid placement');
            }
            break;
        case 'MOVE': 
            if (isPlaced === false) return console.log('Need to place first');
            currentPosition = move(currentPosition);
            break;
        case 'LEFT': 
        if (isPlaced === false) return console.log('Need to place first');
            currentPosition = changeDirection(currentPosition, 'LEFT');
            break;
        case 'RIGHT': 
        if (isPlaced === false) return console.log('Need to place first');
            currentPosition = changeDirection(currentPosition, 'RIGHT');
            break;
        case 'REPORT':
            if (isPlaced === false) return console.log('Need to place first');
            console.log(`${currentPosition.x},${currentPosition.y},${currentPosition.facing}`);
            break;
        default: 
            console.log('Invalid command');
            break;
    }
});

app.listen(port, () => {
    console.log(`Toy robot simulator running at http://localhost:${port}`);
});