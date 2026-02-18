const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const VerifyLost = require('../models/VerifyLost');
const VerifyFound = require('../models/VerifyFound');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files to 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Use a unique filename: timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create Lost Item with Image Upload
router.post('/lost', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const itemData = req.body;
        // Always bind post ownership to the authenticated user.
        itemData.user_id = req.user.id;
        if (req.file) {
            itemData.image = req.file.path; // Store file path in database
        }

        const item = await LostItem.create(itemData);
        res.status(201).json({ message: 'Lost item reported successfully', item });
    } catch (error) {
        res.status(500).json({ error: 'Error reporting lost item', details: error.message });
    }
});

// Create Found Item with Image Upload
router.post('/found', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const itemData = req.body;
        // Always bind post ownership to the authenticated user.
        itemData.user_id = req.user.id;
        if (req.file) {
            itemData.image = req.file.path; // Store file path in database
        }

        const item = await FoundItem.create(itemData);
        res.status(201).json({ message: 'Found item reported successfully', item });
    } catch (error) {
        res.status(500).json({ error: 'Error reporting found item', details: error.message });
    }
});

// Get all Lost Items
router.get('/lost', async (req, res) => {
    try {
        const items = await LostItem.findAll({
            where: {
                status: { [Op.ne]: 'Successful' }
            }
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching lost items' });
    }
});

// Get all Found Items
router.get('/found', async (req, res) => {
    try {
        const items = await FoundItem.findAll({
            where: {
                status: { [Op.ne]: 'Successful' }
            }
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching found items' });
    }
});

// Claim Verification for Lost Item (Someone found it)
router.post('/verify-lost', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const claimData = req.body;
        if (req.file) {
            claimData.proof_image = req.file.path;
        }
        const claim = await VerifyLost.create(claimData);
        res.status(201).json({ message: 'Claim submitted successfully', claim });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting claim', details: error.message });
    }
});

// Claim Verification for Found Item (Someone lost it)
router.post('/verify-found', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const claimData = req.body;
        if (req.file) {
            claimData.proof_image = req.file.path;
        }
        const claim = await VerifyFound.create(claimData);
        res.status(201).json({ message: 'Claim submitted successfully', claim });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting claim', details: error.message });
    }
});

// Get items by User ID
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const lostItems = await LostItem.findAll({ where: { user_id: userId } });
        const foundItems = await FoundItem.findAll({ where: { user_id: userId } });

        // Add type for frontend distinguish
        const lostWithTypes = lostItems.map(item => ({ ...item.toJSON(), type: 'LOST ITEM', typeClass: 'lost-label' }));
        const foundWithTypes = foundItems.map(item => ({ ...item.toJSON(), type: 'FOUND ITEM', typeClass: 'found-label' }));

        res.status(200).json([...lostWithTypes, ...foundWithTypes]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user items', details: error.message });
    }
});

// Delete Lost Item
router.delete('/lost/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        // Explicitly delete associated claims first to avoid foreign key constraints
        await VerifyLost.destroy({ where: { lost_item_id: id } });
        await LostItem.destroy({ where: { id } });
        res.status(200).json({ message: 'Lost item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting lost item', details: error.message });
    }
});

// Delete Found Item
router.delete('/found/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        // Explicitly delete associated claims first to avoid foreign key constraints
        await VerifyFound.destroy({ where: { found_item_id: id } });
        await FoundItem.destroy({ where: { id } });
        res.status(200).json({ message: 'Found item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting found item', details: error.message });
    }
});

// Get claims submitted by User ID
router.get('/user-claims/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || userId === 'null' || userId === 'undefined') {
            return res.status(400).json({ error: 'Invalid User ID provided' });
        }
        const lostClaims = await VerifyLost.findAll({ where: { user_id: userId } });

        const foundClaims = await VerifyFound.findAll({ where: { user_id: userId } });

        // Fetch associated items and their owners for each claim
        const lostClaimsWithItems = await Promise.all(lostClaims.map(async (claim) => {
            const item = await LostItem.findByPk(claim.lost_item_id, {
                include: [{ model: User, attributes: ['name', 'email'] }]
            });
            return {
                ...claim.toJSON(),
                type: 'LOST ITEM',
                typeClass: 'lost-label',
                item_details: item ? item.toJSON() : null,
                posted_by_name: item && item.user ? item.user.name : 'Unknown',
                owner_details: item && item.user ? {
                    name: item.user.name,
                    email: item.user.email,
                    phone: item.contact_info
                } : null
            };

        }));

        const foundClaimsWithItems = await Promise.all(foundClaims.map(async (claim) => {
            const item = await FoundItem.findByPk(claim.found_item_id, {
                include: [{ model: User, attributes: ['name', 'email'] }]
            });
            return {
                ...claim.toJSON(),
                type: 'FOUND ITEM',
                typeClass: 'found-label',
                item_details: item,
                posted_by_name: item && item.user ? item.user.name : 'Unknown',
                owner_details: item && item.user ? {
                    name: item.user.name,
                    email: item.user.email,
                    phone: item.contact_info
                } : null
            };
        }));

        res.status(200).json([...lostClaimsWithItems, ...foundClaimsWithItems]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user claims', details: error.message });
    }
});



// Get claims received for items owned by User ID
router.get('/received-claims/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const User = require('../models/User'); // Import User for association

        // 1. Find items owned by this user
        const lostItems = await LostItem.findAll({ where: { user_id: userId } });
        const foundItems = await FoundItem.findAll({ where: { user_id: userId } });

        const lostItemIds = lostItems.map(item => item.id);
        const foundItemIds = foundItems.map(item => item.id);

        let lostClaimsWithItems = [];
        let foundClaimsWithItems = [];

        // 2. Fetch claims ONLY if the user has items of that type to prevent empty IN clauses or unnecessary queries
        if (lostItemIds.length > 0) {
            const lostClaims = await VerifyLost.findAll({
                where: { lost_item_id: lostItemIds },
                include: [{ model: User, attributes: ['name', 'email'] }]
            });
            lostClaimsWithItems = lostClaims.map(claim => {
                const item = lostItems.find(i => i.id === claim.lost_item_id);
                return {
                    ...claim.toJSON(),
                    type: 'LOST ITEM',
                    typeClass: 'lost-label',
                    item_details: item ? item.toJSON() : null,
                    claimant_details: claim.user ? claim.user.toJSON() : null,
                    requested_by_name: claim.user?.name || 'Unknown'
                };
            });
        }

        if (foundItemIds.length > 0) {
            const foundClaims = await VerifyFound.findAll({
                where: { found_item_id: foundItemIds },
                include: [{ model: User, attributes: ['name', 'email'] }]
            });
            foundClaimsWithItems = foundClaims.map(claim => {
                const item = foundItems.find(i => i.id === claim.found_item_id);
                return {
                    ...claim.toJSON(),
                    type: 'FOUND ITEM',
                    typeClass: 'found-label',
                    item_details: item ? item.toJSON() : null,
                    claimant_details: claim.user ? claim.user.toJSON() : null,
                    requested_by_name: claim.user?.name || claim.full_name || 'Unknown'
                };
            });
        }

        res.status(200).json([...lostClaimsWithItems, ...foundClaimsWithItems]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching received claims', details: error.message });
    }
});



// Update VerifyLost Status (Accept/Reject)
router.patch('/verify-lost/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        // ... (existing logic)
        const { status } = req.body;

        console.log(`Updating VerifyLost claim ${id} to status: ${status}`);
        await VerifyLost.update({ status }, { where: { id } });

        if (status === 'Accepted') {
            const claim = await VerifyLost.findByPk(id);
            if (claim && claim.lost_item_id) {
                console.log(`Claim Accepted! Updating LostItem ${claim.lost_item_id} status to Successful`);
                await LostItem.update(
                    { status: 'Successful', successful_claim_id: id },
                    { where: { id: claim.lost_item_id } }
                );
            }
        }

        res.status(200).json({ message: `Claim ${status} successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Error updating claim status' });
    }
});

// Update VerifyFound Status (Accept/Reject)
router.patch('/verify-found/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`Updating VerifyFound claim ${id} to status: ${status}`);
        await VerifyFound.update({ status }, { where: { id } });

        if (status === 'Accepted') {
            const claim = await VerifyFound.findByPk(id);
            if (claim && claim.found_item_id) {
                console.log(`Claim Accepted! Updating FoundItem ${claim.found_item_id} status to Successful`);
                await FoundItem.update(
                    { status: 'Successful', successful_claim_id: id },
                    { where: { id: claim.found_item_id } }
                );
            }
        }

        res.status(200).json({ message: `Claim ${status} successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Error updating claim status' });
    }
});

// Delete VerifyLost Claim
router.delete('/verify-lost/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await VerifyLost.destroy({ where: { id } });
        res.status(200).json({ message: 'Claim deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting claim' });
    }
});

// Delete VerifyFound Claim
router.delete('/verify-found/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await VerifyFound.destroy({ where: { id } });
        res.status(200).json({ message: 'Claim deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting claim' });
    }
});

// Get Statistics for Dashboard
router.get('/user-stats/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || userId === 'null' || userId === 'undefined') {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        // 1. My Posts Count
        const lostPostsCount = await LostItem.count({ where: { user_id: userId } });
        const foundPostsCount = await FoundItem.count({ where: { user_id: userId } });
        const myPosts = lostPostsCount + foundPostsCount;

        // 2. Pending Claims (Received claims on user's items)
        const lostItems = await LostItem.findAll({ where: { user_id: userId }, attributes: ['id'] });
        const foundItems = await FoundItem.findAll({ where: { user_id: userId }, attributes: ['id'] });

        const lostItemIds = lostItems.map(i => i.id);
        const foundItemIds = foundItems.map(i => i.id);

        const pendingLostClaims = lostItemIds.length > 0 ? await VerifyLost.count({ where: { lost_item_id: lostItemIds, status: 'Pending' } }) : 0;
        const pendingFoundClaims = foundItemIds.length > 0 ? await VerifyFound.count({ where: { found_item_id: foundItemIds, status: 'Pending' } }) : 0;
        const pendingClaims = pendingLostClaims + pendingFoundClaims;

        // 3. Claim Request (Claims sent by user)
        const sentLostClaims = await VerifyLost.count({ where: { user_id: userId } });
        const sentFoundClaims = await VerifyFound.count({ where: { user_id: userId } });
        const claimRequests = sentLostClaims + sentFoundClaims;

        res.status(200).json({
            myPosts,
            pendingClaims,
            claimRequests
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user stats', details: error.message });
    }
});

module.exports = router;




