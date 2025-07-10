# Deployment Guide - Employee Management System

## 🚀 Deploy to Render (Recommended - Free Tier)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Ensure these files are in your repository**:
   - `render.yaml` (deployment config)
   - `package.json` (dependencies)
   - `server.js` (main entry point)
   - `.env` (environment variables - will be set in Render)

### Step 2: Deploy to Render

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `employee-management-system`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `PORT`: `10000` (Render will set this automatically)

6. **Click "Create Web Service"**

### Step 3: Update Postman Collection

After deployment, update your Postman environment:
- **base_url**: `https://your-app-name.onrender.com`

---

## 🚀 Alternative: Deploy to Railway

### Step 1: Prepare for Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

### Step 2: Deploy

1. **Initialize Railway project**:
   ```bash
   railway init
   ```

2. **Set environment variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=your_mongodb_atlas_uri
   railway variables set JWT_SECRET=your_jwt_secret
   ```

3. **Deploy**:
   ```bash
   railway up
   ```

---

## 🚀 Alternative: Deploy to Heroku

### Step 1: Prepare for Heroku

1. **Install Heroku CLI**
2. **Create `Procfile`**:
   ```
   web: npm start
   ```

### Step 2: Deploy

1. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

---

## 🔧 Environment Variables Setup

### Required Variables for Production

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_management
JWT_SECRET=your_super_secret_jwt_key_here
PORT=10000
```

### MongoDB Atlas Setup

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create/Select your cluster**
3. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/employee_management
   ```
4. **Replace username, password, and database name**

---

## 📊 Post-Deployment Testing

### 1. Test Your Deployed API

Update your Postman environment with the new base URL:
- **Local**: `http://localhost:3000`
- **Deployed**: `https://your-app-name.onrender.com`

### 2. Test All Endpoints

1. **Register a new user**
2. **Login with credentials**
3. **Test CRUD operations**
4. **Test advanced features**
5. **Test analytics**

### 3. Verify Environment Variables

Check that all environment variables are properly set in your cloud platform dashboard.

---

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check `package.json` has all dependencies
   - Verify Node.js version compatibility

2. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas

3. **Environment Variables**:
   - Ensure all required variables are set
   - Check variable names match exactly

4. **Port Issues**:
   - Let the platform set the PORT automatically
   - Don't hardcode port numbers

### Debug Commands

```bash
# Check logs
railway logs
heroku logs --tail

# Check environment variables
railway variables
heroku config
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] MongoDB Atlas connection tested
- [ ] Build successful
- [ ] API endpoints responding
- [ ] Postman collection updated
- [ ] Documentation updated with new URLs

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ API responds to requests
- ✅ Database connection works
- ✅ Authentication works
- ✅ All CRUD operations work
- ✅ Advanced features work
- ✅ Analytics endpoints work

---

## 📝 Update Documentation

After deployment, update:
1. **API_DOCUMENTATION.md** - Change base URL
2. **Postman collection** - Update environment variables
3. **README.md** - Add deployment instructions

**Happy Deploying! 🚀** 