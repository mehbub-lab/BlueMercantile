import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client for auth operations
const supabase = createClient(
  Deno.env.get("https://kufulblumrhnbphualpc.supabase.co"),
  Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1ZnVsYmx1bXJobmJwaHVhbHBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg5NzIxNiwiZXhwIjoyMDc0NDczMjE2fQ.vO7Jj4LbI1MzlnAdFSHGl4Das8K5XNnXOCUYXi6nKdc"),
);

// Generate random password
function generateRandomPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Generate unique ID
function generateUniqueId(userType: string): string {
  const prefix = userType === 'patron' ? 'ptrn' : 'crdcl';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomNum}`;
}

// Send email notification
async function sendEmail(to: string, subject: string, content: string) {
  try {
    // In a real implementation, you would integrate with an email service
    // For now, we'll log the email content
    console.log(`EMAIL TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT: ${content}`);
    
    // Store email in KV for admin to see
    const emailLog = await kv.get('email_logs') || [];
    emailLog.push({
      to,
      subject,
      content,
      timestamp: new Date().toISOString()
    });
    await kv.set('email_logs', emailLog);
    
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

// Health check endpoint
app.get("/make-server-c7236e13/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin login
app.post("/make-server-c7236e13/admin/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    if (username === 'admin' && password === 'Qwerty') {
      return c.json({ 
        success: true, 
        token: 'admin-token',
        userType: 'admin'
      });
    }
    
    return c.json({ success: false, message: 'Invalid credentials' }, 401);
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({ success: false, message: 'Login failed' }, 500);
  }
});

// User login
app.post("/make-server-c7236e13/user/login", async (c) => {
  try {
    const { userId, password } = await c.req.json();
    
    // Get user from KV store
    const users = await kv.get('approved_users') || [];
    const user = users.find(u => u.userId === userId && u.password === password);
    
    if (user) {
      return c.json({ 
        success: true, 
        token: `user-${userId}`,
        userType: user.userType,
        userId: user.userId,
        userData: user
      });
    }
    
    return c.json({ success: false, message: 'Invalid credentials' }, 401);
  } catch (error) {
    console.error('User login error:', error);
    return c.json({ success: false, message: 'Login failed' }, 500);
  }
});

// Submit registration
app.post("/make-server-c7236e13/register", async (c) => {
  try {
    const registrationData = await c.req.json();
    
    // Store in pending registrations
    const pendingRegistrations = await kv.get('pending_registrations') || [];
    const registrationId = `reg_${Date.now()}`;
    
    const registration = {
      id: registrationId,
      ...registrationData,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    pendingRegistrations.push(registration);
    await kv.set('pending_registrations', pendingRegistrations);
    
    return c.json({ 
      success: true, 
      message: 'Registration submitted successfully. Admin approval required.',
      registrationId
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ success: false, message: 'Registration failed' }, 500);
  }
});

// Get pending registrations (admin only)
app.get("/make-server-c7236e13/admin/pending-registrations", async (c) => {
  try {
    const pendingRegistrations = await kv.get('pending_registrations') || [];
    return c.json({ success: true, data: pendingRegistrations });
  } catch (error) {
    console.error('Get pending registrations error:', error);
    return c.json({ success: false, message: 'Failed to fetch registrations' }, 500);
  }
});

// Approve registration
app.post("/make-server-c7236e13/admin/approve-registration", async (c) => {
  try {
    const { registrationId } = await c.req.json();
    
    // Get pending registrations
    const pendingRegistrations = await kv.get('pending_registrations') || [];
    const registrationIndex = pendingRegistrations.findIndex(r => r.id === registrationId);
    
    if (registrationIndex === -1) {
      return c.json({ success: false, message: 'Registration not found' }, 404);
    }
    
    const registration = pendingRegistrations[registrationIndex];
    
    // Generate credentials
    const userId = generateUniqueId(registration.userType);
    const password = generateRandomPassword();
    
    // Create approved user
    const approvedUser = {
      ...registration,
      userId,
      password,
      approvedAt: new Date().toISOString(),
      status: 'approved'
    };
    
    // Add to approved users
    const approvedUsers = await kv.get('approved_users') || [];
    approvedUsers.push(approvedUser);
    await kv.set('approved_users', approvedUsers);
    
    // Remove from pending
    pendingRegistrations.splice(registrationIndex, 1);
    await kv.set('pending_registrations', pendingRegistrations);
    
    // Send approval email
    const emailSubject = 'BlueMercantile Account Approved';
    const emailContent = `
    Dear ${registration.fullName},
    
    Your BlueMercantile account has been approved!
    
    Your login credentials:
    User ID: ${userId}
    Password: ${password}
    
    You can now login to your account and start using BlueMercantile.
    
    Best regards,
    BlueMercantile Team
    `;
    
    await sendEmail(registration.email, emailSubject, emailContent);
    
    return c.json({ 
      success: true, 
      message: 'Registration approved successfully',
      userId,
      password
    });
  } catch (error) {
    console.error('Approval error:', error);
    return c.json({ success: false, message: 'Approval failed' }, 500);
  }
});

// Reject registration
app.post("/make-server-c7236e13/admin/reject-registration", async (c) => {
  try {
    const { registrationId, reason } = await c.req.json();
    
    // Get pending registrations
    const pendingRegistrations = await kv.get('pending_registrations') || [];
    const registrationIndex = pendingRegistrations.findIndex(r => r.id === registrationId);
    
    if (registrationIndex === -1) {
      return c.json({ success: false, message: 'Registration not found' }, 404);
    }
    
    const registration = pendingRegistrations[registrationIndex];
    
    // Send rejection email
    const emailSubject = 'BlueMercantile Registration Rejected';
    const emailContent = `
    Dear ${registration.fullName},
    
    Unfortunately, your BlueMercantile registration has been rejected.
    
    Reason: ${reason}
    
    If you have any questions, please contact our support team.
    
    Best regards,
    BlueMercantile Team
    `;
    
    await sendEmail(registration.email, emailSubject, emailContent);
    
    // Remove from pending
    pendingRegistrations.splice(registrationIndex, 1);
    await kv.set('pending_registrations', pendingRegistrations);
    
    return c.json({ 
      success: true, 
      message: 'Registration rejected successfully'
    });
  } catch (error) {
    console.error('Rejection error:', error);
    return c.json({ success: false, message: 'Rejection failed' }, 500);
  }
});

// Get approved users (admin only)
app.get("/make-server-c7236e13/admin/approved-users", async (c) => {
  try {
    const approvedUsers = await kv.get('approved_users') || [];
    return c.json({ success: true, data: approvedUsers });
  } catch (error) {
    console.error('Get approved users error:', error);
    return c.json({ success: false, message: 'Failed to fetch users' }, 500);
  }
});

// Ban/unban user
app.post("/make-server-c7236e13/admin/toggle-user-status", async (c) => {
  try {
    const { userId, banned } = await c.req.json();
    
    const approvedUsers = await kv.get('approved_users') || [];
    const userIndex = approvedUsers.findIndex(u => u.userId === userId);
    
    if (userIndex === -1) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }
    
    approvedUsers[userIndex].banned = banned;
    await kv.set('approved_users', approvedUsers);
    
    return c.json({ 
      success: true, 
      message: `User ${banned ? 'banned' : 'unbanned'} successfully`
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    return c.json({ success: false, message: 'Failed to update user status' }, 500);
  }
});

// Change user password
app.post("/make-server-c7236e13/admin/change-password", async (c) => {
  try {
    const { userId, newPassword } = await c.req.json();
    
    const approvedUsers = await kv.get('approved_users') || [];
    const userIndex = approvedUsers.findIndex(u => u.userId === userId);
    
    if (userIndex === -1) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }
    
    approvedUsers[userIndex].password = newPassword;
    await kv.set('approved_users', approvedUsers);
    
    return c.json({ 
      success: true, 
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({ success: false, message: 'Failed to change password' }, 500);
  }
});

// Get email logs (admin only)
app.get("/make-server-c7236e13/admin/email-logs", async (c) => {
  try {
    const emailLogs = await kv.get('email_logs') || [];
    return c.json({ success: true, data: emailLogs });
  } catch (error) {
    console.error('Get email logs error:', error);
    return c.json({ success: false, message: 'Failed to fetch email logs' }, 500);
  }
});

Deno.serve(app.fetch);
