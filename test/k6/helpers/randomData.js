import faker from "k6/x/faker"

let nameFaker = faker.person.firstName();
export function randomEmail(){
     const rand = Math.random().toString(36).substring(2, 8);
  return `test_${Date.now()}_${rand}@example.com`
}

export function randomPassword(){
    return `Pass${Math.random().toString(36).slice(-8)}`;
}   

export function randomName(){
    return nameFaker + '_' + Math.random().toString(36).substring(2, 8);
}

export function favorecidosData(){
    return`favorecido_${Math.random().toString(36).substring(2, 8)}`;
}