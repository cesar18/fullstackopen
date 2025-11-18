const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })
  
  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('login')).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const button = page.getByRole('button', { name: 'login' })
      await loginWith(page, 'mluukkai', 'salainen')
      const notDiv = page.locator('.notification')
      await expect(notDiv).toContainText('login successful')
      await expect(notDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
      await expect(notDiv).toHaveCSS('border-style', 'solid')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const button = page.getByRole('button', { name: 'login' })
      await loginWith(page, 'mluukkai', 'wrong')
      const notDiv = page.locator('.notification')
      await expect(notDiv).toContainText('invalid username or password')
      await expect(notDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(notDiv).toHaveCSS('border-style', 'solid')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      // each test starts with a 'zero state' browser, so informations of login are lost
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created by playwright',
        'ABC Author',
        'http://blogbyplaywright.com'
      )
      const notDiv = page.locator('.notification')
      await expect(notDiv).toContainText('a new blog a blog created by playwright by ABC Author added')
      await expect(notDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
      await expect(notDiv).toHaveCSS('border-style', 'solid')
      await expect(page.getByText('a blog created by playwright ABC Author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'a blog created by playwright',
          'ABC Author',
          'http://blogbyplaywright.com'
        )
      })
  
      test('likes can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await expect(page.getByText('http://blogbyplaywright.com')).toBeVisible()
        await expect(page.getByText('Matti Luukkainen', {exact: true})).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 2')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 3')).toBeVisible()
      })

      test('blog could be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', async dialog => {
          await expect(dialog.message()).toContain('Remove blog a blog created by playwright by ABC Author?')
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('a blog created by playwright ABC Author')).not.toBeVisible()
      })
      describe('and login wtih another account', () => {
        beforeEach(async ({ page, request }) => {
          await request.post('/api/users', {
            data: {
              name: 'Second User',
              username: 'seconduser',
              password: 'password123'
            }
          })
          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'seconduser', 'password123')
        })
        test('blog delete button is not shown', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'first blog created by playwright',
          'ABC Author 1',
          'http://blogbyplaywright.com'
        )
        await createBlog(
          page,
          'second blog created by playwright',
          'ABC Author 2',
          'http://blogbyplaywright.com'
        )
        await createBlog(
          page,
          'third blog created by playwright',
          'ABC Author 3',
          'http://blogbyplaywright.com'
        )
      })

      test('blogs are ordered by likes', async ({ page }) => {
        // Adiciona 1 likes no terceiro blog
        await likeBlog(page, 'third blog created by playwright', 'ABC Author 3', 1)
        
        await expect(page.locator('.blog').nth(0)).toContainText('third blog created by playwright ABC Author 3')
        await expect(page.locator('.blog').nth(1)).toContainText('first blog created by playwright ABC Author 1')
        await expect(page.locator('.blog').nth(2)).toContainText('second blog created by playwright ABC Author 2')
        
        // Adiciona 2 likew no segundo blog
        await likeBlog(page, 'second blog created by playwright', 'ABC Author 2', 2)

        await expect(page.locator('.blog').nth(0)).toContainText('second blog created by playwright ABC Author 2')
        await expect(page.locator('.blog').nth(1)).toContainText('third blog created by playwright ABC Author 3')
        await expect(page.locator('.blog').nth(2)).toContainText('first blog created by playwright ABC Author 1')

        // Adiciona 3 likew no primeiro blog
        await likeBlog(page, 'first blog created by playwright', 'ABC Author 1', 3)

        await expect(page.locator('.blog').nth(0)).toContainText('first blog created by playwright ABC Author 1')
        await expect(page.locator('.blog').nth(1)).toContainText('second blog created by playwright ABC Author 2')
        await expect(page.locator('.blog').nth(2)).toContainText('third blog created by playwright ABC Author 3')
      
        
      })
    })
  })
})