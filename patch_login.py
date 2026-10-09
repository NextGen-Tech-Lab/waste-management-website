import re
path = r'c:\Users\ankur\OneDrive\Desktop\Projects\waste-management-website-main\frontend\src\pages\Login.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update handleCitizenLogin
content = content.replace(
    'const authResult = await login(email, password);',
    'const authResult = await login(email, password, \'user\');'
)

old_citizen_check = '''      // Check if the authenticated account is actually an admin.
      // The login response always includes the user role.
      const role = authResult?.user?.role;
      if (role === 'admin') {
        // Log the session out immediately so the admin token isn't left active.
        logout();
        setCitizenError(
          '?? These are admin credentials. Please click the "Admin" tab above to log in as an administrator.'
        );
        return;
      }'''
content = content.replace(old_citizen_check, '')

old_admin_check = '''      const isAdmin = authResult?.user?.role === 'admin';
      if (!isAdmin) {
        // Log the session out immediately so the citizen token isn't left active.
        logout();
        setAdminError(
          '?? These are citizen credentials. Please click the "Citizen" tab above to log in as a regular user.'
        );
        return;
      }'''
content = content.replace(old_admin_check, '')

# Update handleAdminLogin
# But it was already replaced by the first replace?
# The first replace replaces all instances, but we need to fix it for admin explicitly since the first replace will change it to 'user' if it matches exactly. Wait!
# The second one might have been replaced to 'user' as well if it was identical.
