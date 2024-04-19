import { Page } from '@playwright/test'

export class DataGenerators {

    generateRandomString(length: number): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;

    }

    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min)
    }


}