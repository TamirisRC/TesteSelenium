const assert = require('assert');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
    const options = new chrome.Options();
    options.addArguments('start-maximized');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const testResults = {
        assertions: [],
        success: true,
    };

    try {
        await driver.get('https://github.com/login');
        await driver.findElement(By.id('login_field')).sendKeys('TamirisRC');
        await driver.findElement(By.id('password')).sendKeys('Ta203032', Key.RETURN);
        await driver.wait(until.titleIs('GitHub'), 15000);
        await driver.get('https://github.com/TamirisRC/PortfolioAMS2023-3DS.git');
        await driver.wait(until.titleContains('Portfolio DS - 2023'), 15000);

        console.log('Antes de esperar pelo elemento');
        await driver.wait(until.elementLocated(By.css('h1 strong a')), 30000);
        console.log('Após esperar pelo elemento');

        const repoName = await driver.findElement(By.css('h1 strong a')).getText();

        await driver.get('https://www.google.com');
        await driver.findElement(By.name('q')).sendKeys(`${repoName} site:github.com`, Key.RETURN);
        await driver.wait(until.titleContains(`${repoName} - Pesquisa Google`), 15000);

        const repoLinkSelector = `a[href*="${repoName}"][href*="github.com"]`;
        const repoLink = await driver.findElement(By.css(repoLinkSelector));

        assert.ok(repoLink,'O repositório não é compatível nos resultados do Google.');
        testResults.assertions.push('Assertion: O repositório é compatível nos resultados do Google.');

    } catch (error) {
        console.error('Erro:', error.message);
        testResults.success = false;
        testResults.error = error.message;
    } finally {
        await driver.quit();
    }
  
    console.log('\nResultados:');
    console.log(testResults);
}
runTest();
 