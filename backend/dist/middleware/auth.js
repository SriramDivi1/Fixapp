import { supabase } from '@/config/database';
export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }
        // Verify the token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        // Get user profile from database
        const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        if (profileError || !userProfile) {
            return res.status(401).json({
                success: false,
                message: 'User profile not found'
            });
        }
        if (!userProfile.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }
        req.user = userProfile;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        next();
    };
};
// Specific role middlewares
export const requireAdmin = requireRole(['admin']);
export const requireDoctor = requireRole(['doctor']);
export const requirePatient = requireRole(['patient']);
export const requireDoctorOrAdmin = requireRole(['doctor', 'admin']);
//# sourceMappingURL=auth.js.map