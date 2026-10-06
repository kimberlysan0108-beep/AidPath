import {test,expect} from '@playwright/test';
test('student reaches source and saves an action plan',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/Food & groceries/}).click();
 for(const answer of ['Yes','In the next few weeks','Ongoing food benefits']){await page.getByRole('button',{name:new RegExp(answer)}).click();}
 await expect(page.getByRole('heading',{name:'A starting point, chosen for you.'})).toBeVisible();
 await page.getByRole('button',{name:'View reasoning & steps'}).first().click();await expect(page.getByRole('heading',{name:'CalFresh application assistance'}).last()).toBeVisible();
 await expect(page.getByRole('link',{name:'Read official Berkeley source'})).toHaveAttribute('href','https://basicneeds.berkeley.edu/calfresh');
 await page.getByRole('button',{name:'Save to my action plan',exact:true}).click();await expect(page.getByRole('button',{name:'Saved to my action plan',exact:true})).toBeVisible();
});
