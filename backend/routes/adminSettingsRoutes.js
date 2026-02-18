const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/authMiddleware');
const Admin = require('../models/Admin');
const AdminSetting = require('../models/AdminSetting');
const User = require('../models/User');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const VerifyLost = require('../models/VerifyLost');
const VerifyFound = require('../models/VerifyFound');
const ContactMessage = require('../models/ContactMessage');

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

const getOrCreateSettings = async () => {
    const [settings] = await AdminSetting.findOrCreate({
        where: { id: 1 },
        defaults: {
            email: 'finditback@lostfound.com',
            phone: '+94 77 123 4567',
            working_hours: 'Mon - Fri: 9AM to 6PM'
        }
    });
    return settings;
};

router.get('/settings/contact', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.status(200).json({
            email: settings.email,
            phone: settings.phone,
            workingHours: settings.working_hours
        });
    } catch (error) {
        console.error('Error loading admin contact settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/settings/contact', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { email, phone, workingHours } = req.body;

        if (!email || !phone || !workingHours) {
            return res.status(400).json({ message: 'Email, phone and working hours are required' });
        }

        const settings = await getOrCreateSettings();
        await settings.update({
            email,
            phone,
            working_hours: workingHours
        });

        res.status(200).json({
            message: 'Contact settings updated successfully',
            settings: {
                email: settings.email,
                phone: settings.phone,
                workingHours: settings.working_hours
            }
        });
    } catch (error) {
        console.error('Error updating admin contact settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/settings/admins', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: ['id', 'email', 'createdAt'],
            order: [['id', 'ASC']]
        });
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admin accounts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/settings/admins', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existing = await Admin.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Admin email already exists' });
        }

        const admin = await Admin.create({ email, password });
        res.status(201).json({
            message: 'Admin added successfully',
            admin: {
                id: admin.id,
                email: admin.email,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/settings/admins/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const adminId = Number(req.params.id);
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const duplicate = await Admin.findOne({
            where: {
                email,
                id: { [Op.ne]: adminId }
            }
        });
        if (duplicate) {
            return res.status(400).json({ message: 'Admin email already exists' });
        }

        const updateData = { email };
        if (password) {
            updateData.password = password;
        }

        await admin.update(updateData);

        res.status(200).json({
            message: 'Admin updated successfully',
            admin: {
                id: admin.id,
                email: admin.email,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/settings/admins/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const adminId = Number(req.params.id);
        const tokenAdminId = Number(req.user.id);

        if (adminId === tokenAdminId) {
            return res.status(400).json({ message: 'You cannot delete your own admin account' });
        }

        const totalAdmins = await Admin.count();
        if (totalAdmins <= 1) {
            return res.status(400).json({ message: 'Cannot delete the last admin account' });
        }

        const deleted = await Admin.destroy({ where: { id: adminId } });
        if (!deleted) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/settings/users', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/settings/users/:id/status', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { status } = req.body;

        if (!['Active', 'Block'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ status });
        res.status(200).json({
            message: 'User status updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/settings/posts', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const [lostPosts, foundPosts] = await Promise.all([
            LostItem.findAll({ order: [['createdAt', 'DESC']] }),
            FoundItem.findAll({ order: [['createdAt', 'DESC']] })
        ]);

        const userIds = [
            ...lostPosts.map((item) => item.user_id).filter(Boolean),
            ...foundPosts.map((item) => item.user_id).filter(Boolean)
        ];
        const uniqueUserIds = [...new Set(userIds)];

        const users = uniqueUserIds.length > 0
            ? await User.findAll({
                where: { id: uniqueUserIds },
                attributes: ['id', 'name', 'email']
            })
            : [];
        const userMap = new Map(users.map((u) => [u.id, u]));

        const formattedLost = lostPosts.map(item => ({
            ...item.toJSON(),
            postedBy: {
                name: userMap.get(item.user_id)?.name || 'Unknown',
                email: userMap.get(item.user_id)?.email || 'Not available'
            },
            postType: 'lost'
        }));
        const formattedFound = foundPosts.map(item => ({
            ...item.toJSON(),
            postedBy: {
                name: userMap.get(item.user_id)?.name || 'Unknown',
                email: userMap.get(item.user_id)?.email || 'Not available'
            },
            postType: 'found'
        }));

        const allPosts = [...formattedLost, ...formattedFound].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.status(200).json(allPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/settings/posts/:type/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        const { status, admin_notes } = req.body;

        if (!['lost', 'found'].includes(type)) {
            return res.status(400).json({ message: 'Invalid post type' });
        }

        const Model = type === 'lost' ? LostItem : FoundItem;
        const post = await Model.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const updateData = {};
        if (status) {
            updateData.status = status;
        }
        if (admin_notes !== undefined) {
            updateData.admin_notes = admin_notes;
        }

        await post.update(updateData);

        res.status(200).json({
            message: 'Post updated successfully',
            post: {
                ...post.toJSON(),
                postType: type
            }
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/settings/posts/:type/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;

        if (!['lost', 'found'].includes(type)) {
            return res.status(400).json({ message: 'Invalid post type' });
        }

        if (type === 'lost') {
            await VerifyLost.destroy({ where: { lost_item_id: id } });
            const deleted = await LostItem.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ message: 'Post not found' });
            }
        } else {
            await VerifyFound.destroy({ where: { found_item_id: id } });
            const deleted = await FoundItem.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ message: 'Post not found' });
            }
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/settings/verified', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const [lostClaims, foundClaims] = await Promise.all([
            VerifyLost.findAll({
                include: [{ model: User, attributes: ['id', 'name', 'email'] }],
                order: [['createdAt', 'DESC']]
            }),
            VerifyFound.findAll({
                include: [{ model: User, attributes: ['id', 'name', 'email'] }],
                order: [['createdAt', 'DESC']]
            })
        ]);

        const lostMapped = await Promise.all(lostClaims.map(async (claim) => {
            const item = await LostItem.findByPk(claim.lost_item_id, {
                include: [{ model: User, attributes: ['id', 'name', 'email'] }]
            });
            return {
                id: claim.id,
                claimType: 'lost',
                itemName: item?.name || 'Unknown Item',
                itemPic: item?.image || '',
                type: item?.category || 'Unknown',
                foundOrLost: 'Lost',
                postedBy: {
                    name: item?.user?.name || 'Unknown',
                    email: item?.user?.email || 'Not available'
                },
                claimedBy: {
                    name: claim.user?.name || 'Unknown',
                    email: claim.user?.email || 'Not available'
                },
                status: claim.status || 'Pending',
                createdAt: claim.createdAt
            };
        }));

        const foundMapped = await Promise.all(foundClaims.map(async (claim) => {
            const item = await FoundItem.findByPk(claim.found_item_id, {
                include: [{ model: User, attributes: ['id', 'name', 'email'] }]
            });
            return {
                id: claim.id,
                claimType: 'found',
                itemName: item?.name || 'Unknown Item',
                itemPic: item?.image || '',
                type: item?.category || 'Unknown',
                foundOrLost: 'Found',
                postedBy: {
                    name: item?.user?.name || 'Unknown',
                    email: item?.user?.email || 'Not available'
                },
                claimedBy: {
                    name: claim.user?.name || claim.full_name || 'Unknown',
                    email: claim.user?.email || 'Not available'
                },
                status: claim.status || 'Pending',
                createdAt: claim.createdAt
            };
        }));

        const merged = [...lostMapped, ...foundMapped].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.status(200).json(merged);
    } catch (error) {
        console.error('Error fetching verified claims:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/settings/verified/:type/:id/status', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        const { status } = req.body;

        if (!['lost', 'found'].includes(type)) {
            return res.status(400).json({ message: 'Invalid claim type' });
        }
        if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        if (type === 'lost') {
            const claim = await VerifyLost.findByPk(id);
            if (!claim) {
                return res.status(404).json({ message: 'Claim not found' });
            }
            await claim.update({ status });

            if (claim.lost_item_id) {
                if (status === 'Accepted') {
                    await LostItem.update(
                        { status: 'Successful', successful_claim_id: claim.id },
                        { where: { id: claim.lost_item_id } }
                    );
                } else {
                    await LostItem.update(
                        { status: 'Pending' },
                        { where: { id: claim.lost_item_id, successful_claim_id: claim.id } }
                    );
                }
            }
        } else {
            const claim = await VerifyFound.findByPk(id);
            if (!claim) {
                return res.status(404).json({ message: 'Claim not found' });
            }
            await claim.update({ status });

            if (claim.found_item_id) {
                if (status === 'Accepted') {
                    await FoundItem.update(
                        { status: 'Successful', successful_claim_id: claim.id },
                        { where: { id: claim.found_item_id } }
                    );
                } else {
                    await FoundItem.update(
                        { status: 'Pending' },
                        { where: { id: claim.found_item_id, successful_claim_id: claim.id } }
                    );
                }
            }
        }

        res.status(200).json({ message: 'Claim status updated successfully' });
    } catch (error) {
        console.error('Error updating verified claim status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/settings/dashboard', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const [totalUsers, lostPostsCount, foundPostsCount, acceptedLostClaims, acceptedFoundClaims] = await Promise.all([
            User.count(),
            LostItem.count(),
            FoundItem.count(),
            VerifyLost.count({ where: { status: 'Accepted' } }),
            VerifyFound.count({ where: { status: 'Accepted' } })
        ]);

        const [recentUsers, recentLostItems, recentFoundItems, recentVerifyLost, recentVerifyFound, recentMessages] = await Promise.all([
            User.findAll({ attributes: ['id', 'name', 'createdAt'], order: [['createdAt', 'DESC']], limit: 5 }),
            LostItem.findAll({ attributes: ['id', 'name', 'createdAt'], order: [['createdAt', 'DESC']], limit: 5 }),
            FoundItem.findAll({ attributes: ['id', 'name', 'createdAt'], order: [['createdAt', 'DESC']], limit: 5 }),
            VerifyLost.findAll({ attributes: ['id', 'status', 'createdAt'], order: [['createdAt', 'DESC']], limit: 5 }),
            VerifyFound.findAll({ attributes: ['id', 'status', 'createdAt'], order: [['createdAt', 'DESC']], limit: 5 }),
            ContactMessage.findAll({ attributes: ['id', 'name', 'createdAt'], order: [['createdAt', 'DESC']], limit: 5 })
        ]);

        const recentActivities = [
            ...recentUsers.map((item) => ({
                id: `user-${item.id}`,
                action: `New user registered: ${item.name}`,
                createdAt: item.createdAt
            })),
            ...recentLostItems.map((item) => ({
                id: `lost-${item.id}`,
                action: `Lost post created: ${item.name}`,
                createdAt: item.createdAt
            })),
            ...recentFoundItems.map((item) => ({
                id: `found-${item.id}`,
                action: `Found post created: ${item.name}`,
                createdAt: item.createdAt
            })),
            ...recentVerifyLost.map((item) => ({
                id: `v-lost-${item.id}`,
                action: `Lost-item claim ${item.status.toLowerCase()}`,
                createdAt: item.createdAt
            })),
            ...recentVerifyFound.map((item) => ({
                id: `v-found-${item.id}`,
                action: `Found-item claim ${item.status.toLowerCase()}`,
                createdAt: item.createdAt
            })),
            ...recentMessages.map((item) => ({
                id: `msg-${item.id}`,
                action: `New contact message from ${item.name}`,
                createdAt: item.createdAt
            }))
        ]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 12);

        res.status(200).json({
            totalUsers,
            totalPosts: lostPostsCount + foundPostsCount,
            verifiedClaims: acceptedLostClaims + acceptedFoundClaims,
            recentActivities
        });
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
