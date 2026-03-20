# 🚀 Déploiement ALARWA sur Vercel

## **Déploiement Frontend (Vercel) - 5 minutes**

### Étape 1: Préparer le frontend
```bash
cd frontend
npm run build
```

### Étape 2: Créer un compte Vercel
1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub

### Étape 3: Importer le projet
1. Cliquez **"Add New"** → **"Project"**
2. Sélectionnez le repository `alarwa`
3. Click **"Import"**

### Étape 4: Configurer le déploiement
Dans les paramètres du projet Vercel:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Install Command**: `npm install`

### Étape 5: Variables d'environnement
Dans le dashboard Vercel, ajoutez:
```
NEXT_PUBLIC_API_URL = https://your-backend-url.com
```

### Étape 6: Déployer
Cliquez **"Deploy"** ✨

---

## **Déploiement Backend - 2 Options**

### **Option A: Render.com (Recommandé - Gratuit)**

1. Allez sur https://render.com
2. Cliquez **"New"** → **"Web Service"**
3. Connectez GitHub: `himbak/alarwa`
4. Configuration:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Ajoutez les variables d'environnement:
   - `MONGO_URI` = Votre MongoDB connection string
   - `PORT` = 5000
6. Déployer

### **Option B: Railway.app (Gratuit)**

1. Allez sur https://railway.app
2. Cliquez **"New Project"**
3. **"Deploy from GitHub"** → Sélectionnez `alarwa`
4. Configurez:
   - **Root**: `backend`
   - **Start**: `node server.js`
5. Ajoutez les variables d'environnement
6. Déployer

---

## **Mettre à jour le lien Backend**

Après déploiement du backend, mettez à jour dans Vercel:
1. Dashboard Vercel → Project Settings → Environment Variables
2. Modifiez `NEXT_PUBLIC_API_URL` avec l'URL de votre backend
3. Redéployez le frontend

---

## **Variables d'environnement nécessaires**

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=5000
NODE_ENV=production
```

---

## **Liens utiles**
- [Vercel Docs](https://vercel.com/docs)
- [Render.com Docs](https://render.com/docs)
- [Railway.app Docs](https://docs.railway.app)

---

**Après déploiement**: Votre site sera accessible sur https://votre-nom.vercel.app 🎉
