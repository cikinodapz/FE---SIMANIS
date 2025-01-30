export const refreshToken = async () => {
    const response = await fetch('/auth/refresh-token', {
        method: 'POST',
        credentials: 'include'
    });
    
    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }
    
    return response.json();
};