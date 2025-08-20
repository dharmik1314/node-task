const db = require("../models");
const User = db.User;

// Create and Save a new User
exports.create = async (req, res) => {
    try {
        const { username, email, lastname } = req.body;
        if (!username || !email || !lastname) {
            return res.status(400).send({ message: "All fields are required." });
        }
        const user = await User.create({ username, email, lastname });
        res.status(201).send({ data: user });
    } catch (error) {
        res.status(500).send({ message: "Error creating user: " + error.message });
    }
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
    try {
        // Example: /api/users?username=John&email=john@example.com
        const where = {};
        if (req.query.username) where.username = req.query.username;
        if (req.query.email) where.email = req.query.email;
        if (req.query.lastname) where.lastname = req.query.lastname;

        const users = await User.findAll({ where });
        res.send({ status: 200, message: "Users retrieved successfully", data: users });
    } catch (error) {
        res.status(500).send({ message: "Error retrieving users: " + error.message });
    }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (user) {
            res.send({ status: 200, data: user });
        } else {
            res.status(404).send({ message: `Cannot find user with id=${id}` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving user: " + error.message });
    }
};

// Update a User by the id in the request
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const [updated] = await User.update(req.body, { where: { id } });
        if (updated) {
            const updatedUser = await User.findByPk(id);
            res.status(200).send({ data: updatedUser, message: "User updated successfully." });
        } else {
            res.status(404).send({ message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating user: " + error.message });
    }
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await User.destroy({ where: { id } });
        if (deleted) {
            res.send({ status: 200, message: "User deleted successfully." });
        } else {
            res.status(404).send({ message: `Cannot delete user with id=${id}. Maybe user was not found.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error deleting user: " + error.message });
    }
};

// Bulk add users
exports.bulkCreate = async (req, res) => {
    try {
        const users = req.body.users; // expects { users: [ { username, email, lastname }, ... ] }
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).send({ message: "Users array required." });
        }
        const createdUsers = await User.bulkCreate(users);
        res.status(201).send({ data: createdUsers });
        
    } catch (error) {
        res.status(500).send({ message: "Error bulk creating users: " + error.message });
    }
};

// Bulk update users
exports.bulkUpdate = async (req, res) => {
    try {
        const updates = req.body.updates; // expects { updates: [ { id, ...fields }, ... ] }
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).send({ message: "Updates array required." });
        }
        const results = [];
        for (const update of updates) {
            const { id, ...fields } = update;
            const [updated] = await User.update(fields, { where: { id } });
            if (updated) {
                const updatedUser = await User.findByPk(id);
                results.push(updatedUser);
            }
        }
        res.status(200).send({ data: results, message: "Bulk update completed." });
    } catch (error) {
        res.status(500).send({ message: "Error bulk updating users: " + error.message });
    }
};

