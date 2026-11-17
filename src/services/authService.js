const USERS_KEY='sms-demo-users-v1'
const SESSION_KEY='sms-user'
const DEMO_USERS={
 admin:{id:'demo-admin',name:'Sophea Chan',email:'admin@school.edu',role:'admin',phone:''},
 teacher:{id:'demo-teacher',name:'Dara Sok',email:'teacher@school.edu',role:'teacher',phone:''},
 student:{id:'demo-student',name:'Sokha Lim',email:'student@school.edu',role:'student',phone:''}
}

function readUsers(){try{return JSON.parse(localStorage.getItem(USERS_KEY)||'[]')}catch{return []}}
function writeUsers(users){localStorage.setItem(USERS_KEY,JSON.stringify(users))}
function getStoredSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||sessionStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
function saveSession(user,remember=true){const value=JSON.stringify(user);localStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(SESSION_KEY);(remember?localStorage:sessionStorage).setItem(SESSION_KEY,value)}
function publicUser(user){return {id:user.id,name:user.name,email:user.email,phone:user.phone,role:user.role}}
function toBase64(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes)))}
async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const hash=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:120000,hash:'SHA-256'},key,256);return toBase64(hash)}
function makeSalt(){const bytes=crypto.getRandomValues(new Uint8Array(16));return toBase64(bytes)}

export const authService={
 current(){return getStoredSession()},
 async register({name,email,phone,password,role}){const normalizedEmail=email.trim().toLowerCase();const users=readUsers();if(users.some(user=>user.email===normalizedEmail))throw new Error('EMAIL_EXISTS');const passwordSalt=makeSalt();const user={id:crypto.randomUUID(),name:name.trim(),email:normalizedEmail,phone:phone.trim(),role,passwordSalt,passwordHash:await passwordHash(password,passwordSalt)};writeUsers([...users,user]);const safe=publicUser(user);saveSession(safe,true);return safe},
 async login(email,password,remember=true){const normalizedEmail=email.trim().toLowerCase();const user=readUsers().find(account=>account.email===normalizedEmail);if(!user||await passwordHash(password,user.passwordSalt)!==user.passwordHash)throw new Error('INVALID_CREDENTIALS');const safe=publicUser(user);saveSession(safe,remember);return safe},
 loginDemo(role){const user=DEMO_USERS[role];if(!user)throw new Error('INVALID_DEMO_ROLE');saveSession(user,true);return user},
 requestPasswordReset(email){let requests=[];try{requests=JSON.parse(localStorage.getItem('sms-demo-reset-requests')||'[]')}catch{}requests.push({email:email.trim().toLowerCase(),requestedAt:new Date().toISOString()});localStorage.setItem('sms-demo-reset-requests',JSON.stringify(requests));return true},
 logout(){localStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(SESSION_KEY);localStorage.removeItem('sms-token')}
}
