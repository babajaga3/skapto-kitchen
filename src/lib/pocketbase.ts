import PocketBase from 'pocketbase'


export const pb = new PocketBase('https://skapto-pb.thec0derhere.me')
pb.autoCancellation(false) // temp
