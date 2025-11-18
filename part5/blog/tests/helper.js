const loginWith = async (page, username, password)  => {
  // await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByLabel('Title:').fill(title)
  await page.getByLabel('Author: ').fill(author)
  await page.getByLabel('url: ').fill(url)
  await page.getByRole('button', { name: 'Create Blog' }).click()
  // this line ensures that the blog is created before proceeding
  await page.getByText(`${title} ${author}`).waitFor()
}

const likeBlog = async (page, title, author, x) => {
  await page.getByText(`${title} ${author}`)
    .getByRole('button', { name: 'view' }).click()
  for(let i = 0; i < x; i++) {
    await page.getByText(`${title} ${author}`)
      .getByRole('button', { name: 'like' }).click()
      await page.getByText(`likes ${i + 1}`).waitFor()
  }
  // this line ensures that the like is registered before proceeding
  await page.getByText(`${title} ${author}`)
    .getByRole('button', { name: 'hide' }).click()
}

export {
  loginWith,
  createBlog,
  likeBlog
}