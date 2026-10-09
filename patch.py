import re
path = r'c:\Users\ankur\OneDrive\Desktop\Projects\waste-management-website-main\frontend\src\context\AuthContext.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const login = async (email, password) => {',
    'const login = async (email, password, expectedRole) => {'
)

old_code = '''const response = await authService.login(email, password);
    setToken(response.token);'''

new_code = '''const response = await authService.login(email, password);
    
    if (expectedRole && response.user?.role) {
      if (expectedRole === 'user' && response.user.role === 'admin') {
        throw new Error('These are admin credentials. Please click the \"Admin\" tab above to log in.');
      }
      if (expectedRole === 'admin' && response.user.role === 'user') {
        throw new Error('These are citizen credentials. Please click the \"Citizen\" tab above to log in.');
      }
    }

    setToken(response.token);'''

content = content.replace(old_code, new_code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('AuthContext patched successfully.')
