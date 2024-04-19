import { test, expect } from '@playwright/test';
import { ContactUsForm } from './util/contactUsPage';
import { DataGenerators } from './util/dataGenerators';
import { faker } from '@faker-js/faker';



let validEmail: string
let invalidEmail: string

test.beforeEach(async ({ page }) => {

    // generate valid & invalid email before tests 
    validEmail = faker.internet.email()
    console.log(validEmail)

    invalidEmail = validEmail.replace('@', 'at')
    console.log(invalidEmail)

    // go to home page
    await page.goto('https://webdriveruniversity.com/Contact-Us/contactus.html')
});


// take a screenshot after test execution 
test.afterEach(async ({ page }, testInfo) => {
    const testName = testInfo.title
    const screenshotPath = `./screenshots/${testName}-${Date.now()}-screenshot.png`
    await page.screenshot({ path: screenshotPath })
})

// randomNumber generates a random number to use it in randomName to generate random string with lenght = randomNumber
// randomComment generate string with lenght = 500 symbols
function generateValidRandomFormData(dataGenerators: DataGenerators) {
    const randomNumber = (dataGenerators.getRandomNumber(2, 26)).valueOf()
    const randomValidName = (dataGenerators.generateRandomString(randomNumber)).toString()
    const randomComment = (dataGenerators.generateRandomString(500)).valueOf()

    return { randomValidName, randomComment }
}

// generate invalid name (more that 25 symbols)
function generateIvnalidRandomFormData(dataGenerators: DataGenerators) {
    const randomNumber = (dataGenerators.getRandomNumber(26, 30)).valueOf()
    const randomInvalidName = (dataGenerators.generateRandomString(randomNumber)).toString()

    return { randomInvalidName }
}


test('submit form with valid data', async ({ page }) => {

    const dataGenerators = new DataGenerators()
    const { randomValidName, randomComment } = generateValidRandomFormData(dataGenerators)

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled(randomValidName, randomValidName, validEmail, randomComment)
    const successMessage = page.locator('#contact_reply h1')
    await expect(successMessage).toHaveText("Thank You for your Message!")

})

test('submit form with empty fields', async ({ page }) => {

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled('', '', '', '')
    const errorMessage = page.locator('body')
    await expect(errorMessage).toContainText("Error: all fields are required")

})

test('submit form with invalid email format', async ({ page }) => {

    const dataGenerators = new DataGenerators()
    const { randomValidName, randomComment } = generateValidRandomFormData(dataGenerators)

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled(randomValidName, randomValidName, invalidEmail, randomComment)
    const errorMessage = page.locator('body')
    await expect(errorMessage).toContainText("Error: Invalid email address")
})

test('sumbit form with invalid name (long string)', async ({ page }) => {
    const dataGenerators = new DataGenerators()
    const { randomComment } = generateValidRandomFormData(dataGenerators)
    const { randomInvalidName } = generateIvnalidRandomFormData(dataGenerators)

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled(randomInvalidName, randomInvalidName, validEmail, randomComment)
    const errorMessage = page.locator('body')
    await expect(errorMessage).toContainText("Error: Name is too long")

})

test('sumbit form with invalid name (short string)', async ({ page }) => {
    const dataGenerators = new DataGenerators()
    const { randomComment } = generateValidRandomFormData(dataGenerators)

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.submitFormWithAllFieldsFilled('a', 'a', validEmail, randomComment)
    const errorMessage = page.locator('body')
    await expect(errorMessage).toContainText("Error: Name is too long")

})

test('reset after filling in all information', async ({ page }) => {
    const dataGenerators = new DataGenerators()
    const { randomValidName, randomComment } = generateValidRandomFormData(dataGenerators)

    const onContactUsPage = new ContactUsForm(page)
    await onContactUsPage.fillFormWithAllFields(randomValidName, randomValidName, validEmail, randomComment)
    await page.getByRole('button', { name: 'RESET' }).click()

    const firstName = await page.getByPlaceholder("First Name").getAttribute('placeholder')
    const lastName = await page.getByPlaceholder("Last Name").getAttribute('placeholder')
    const emailField = await page.getByPlaceholder("Email Address").getAttribute('placeholder')
    const comment = await page.getByPlaceholder("Comments").getAttribute('placeholder')

    expect(firstName).toContain("First Name")
    expect(lastName).toContain("Last Name")
    expect(emailField).toContain("Email Address")
    expect(comment).toContain("Comments")
})
