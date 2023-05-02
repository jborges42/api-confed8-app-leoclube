import { initializeApp } from "firebase/app";
import dotenv from 'dotenv';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import express from 'express';

const app = express()
const port = 3000
dotenv.config();

app.use(express.json());

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId:  process.env.PROJECT_ID,
  storageBucket:  process.env.STORAGE_BUCKET,
  messagingSenderId:  process.env.MESSAGING_SENDER_ID,
  appId:  process.env.APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Geração do token
      return userCredential.user.getIdToken();
    })
    .then((token) => {
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ message: error.message });
    });
});
// Rota de redefinição de senha
app.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      res.status(200).json({ message: 'Email de redefinição de senha enviado' });
    })
    .catch((error) => {
      res.status(400).json({ message: 'Erro ao enviar email de redefinição de senha' });
    });
});

// Rota de registro de usuário
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      res.status(200).json({ uid: userCredential.user.uid });
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ message: 'Erro ao registrar usuário' });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

export default app;