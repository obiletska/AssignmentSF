import { test, expect, type Page } from '@playwright/test';
import { ContactUsForm } from './util/contactUsPage';
import { DataGenerators } from './util/dataGenerators';
import { faker } from '@faker-js/faker';


test.beforeEach(async({page}) => {
    await page.goto('https://webdriveruniversity.com/Contact-Us/contactus.html')
})

// randomNumber generates a random number to use it in randomName to generate random string with lenght = randomNumber
// randomComment generate string with lenght = 500 symbols
async function generateValidRandomFormData(dataGenerators: DataGenerators) {
    const randomNumber = (await dataGenerators.getRandomNumber(2, 26)).valueOf();
    const randomValidName = (await dataGenerators.generateRandomName(randomNumber)).toString();
    const randomComment = (await dataGenerators.generateRandomComment(500)).valueOf();

    return { randomValidName, randomComment };
}

// generate invalid name (more that 25 symbols)
async function generateIvnalidRandomFormData(dataGenerators: DataGenerators) {
    const randomNumber = (await dataGenerators.getRandomNumber(26, 30)).valueOf();
    const randomInvalidName = (await dataGenerators.generateRandomName(randomNumber)).toString();

    return { randomInvalidName};
}    

// Generate a valid email address
const validEmail = faker.internet.email();
console.log(validEmail); 

// Generate an invalid email address
const invalidEmail = validEmail.replace('@', 'at');
console.log(invalidEmail); 

test('submit form with valid data', async({page}) => {

    const dataGenerators = new DataGenerators();
    const { randomValidName, randomComment } = await generateValidRandomFormData(dataGenerators);

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled(randomValidName, randomValidName, validEmail, randomComment)
    const successMessage = page.locator('#contact_reply h1')
    await expect(successMessage).toHaveText("Thank You for your Message!")
})

test('submit form with empty fields', async({page}) => {

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled('', '', '', '')
    const errorMessage = page.locator('body')
    await expect(errorMessage).toContainText("Error: all fields are required")
} )

test('submit form with invalid email format', async({page}) => {

    const dataGenerators = new DataGenerators();
    const { randomValidName, randomComment } = await generateValidRandomFormData(dataGenerators);

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled(randomValidName, randomValidName, invalidEmail, randomComment)
    const errorMessage = page.locator('body')
    await expect(errorMessage).toContainText("Error: Invalid email address")
} )

test('sumbit form with invalid name (long string)', async({page}) => {
    const dataGenerators = new DataGenerators();
    const { randomComment } = await generateValidRandomFormData(dataGenerators);
    const { randomInvalidName } = await generateIvnalidRandomFormData(dataGenerators)

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled(randomInvalidName, randomInvalidName, validEmail, randomComment)
    const errorMessage = page.locator('body')
    await expect(errorMessage).toContainText("Error: Name is too long")

})

test('sumbit form with invalid name (short string)', async({page}) => {
    const dataGenerators = new DataGenerators();
    const { randomComment } = await generateValidRandomFormData(dataGenerators);

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled('a', 'a', validEmail, randomComment)
    const errorMessage = page.locator('body')
    await expect(errorMessage).toContainText("Error: Name is too long")

})

test('reset after filling in all information', async({page}) => {
    const dataGenerators = new DataGenerators();
    const { randomValidName, randomComment } = await generateValidRandomFormData(dataGenerators);

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.fillFormWithAllFields(randomValidName, randomValidName, validEmail, randomComment)
    await page.getByRole('button', {name: 'RESET'}).click()
    
    const firstName = await page.getByPlaceholder("First Name").getAttribute('placeholder')
    const lastName = await page.getByPlaceholder("Last Name").getAttribute('placeholder')
    const emailField = await page.getByPlaceholder("Email Address").getAttribute('placeholder')
    const comment = await page.getByPlaceholder("Comments").getAttribute('placeholder')

    expect(firstName).toContain("First Name")
    expect(lastName).toContain("Last Name")
    expect(emailField).toContain("Email Address")
    expect(comment).toContain("Comments")
})