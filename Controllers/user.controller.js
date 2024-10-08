const userService = require('../Services/userService');

const sendOtp = async (req, res) => {
    const { phone_number } = req.body;
    try {
        await userService.sendOtp(phone_number);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { phone_number, code, full_Name, email } = req.body;
    try {
        const verification = await userService.verifyOtp(phone_number, code);
        if (verification.status === 'approved') {
            let user = await userService.findUserByNumber(phone_number);
            if (!user) {
                user = await userService.registerUser(full_Name, phone_number, email);
            }
            const token = userService.generateToken(user);
            await userService.updateUserVerification(user.id, true); // Use user.id
            res.status(200).json({ message: 'User registered successfully', token });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.userData; 

    try {
        const user = await userService.findUserById(id); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user data in the response
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const getUserName = async (req, res) => {
    const { id } = req.userData;

    try {
        const user = await userService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const full_name = user.full_Name;
        const initials = full_name.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
        res.status(200).json({ userName: initials });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    const { id } = req.userData;
    try {
        await userService.updateUserVerification(id, false);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFullName = async (req, res) => {
    const { id } = req.userData;
    const { full_Name } = req.body;

    try {
        const updatedUser = await userService.updateUserFullName(id, full_Name);
        res.status(200).json({ message: 'Full name updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMobileNumber = async (req, res) => {
    const { id } = req.userData;
    const { new_phone_number, code } = req.body;

    try {
        const verification = await userService.verifyOtp(new_phone_number, code);
        if (verification.status !== 'approved') {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        await userService.updateUserPhoneNumber(id, new_phone_number);
        await userService.updateUserVerification(id, true);
        res.status(200).json({ message: 'Mobile number updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmail = async (req, res) => {
    const { id } = req.userData;
    const { newEmail } = req.body;

    try {
        const updatedUser = await userService.updateUserEmail(id, newEmail);
        res.status(200).json({ message: 'Email updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    getUserName,
    logout,
    updateFullName,
    updateMobileNumber,
    getUserById,
    updateEmail
};
