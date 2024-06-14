const getAllUsers = (req, res) => {
  res.send('Get all users');
};

const getUserById = (req, res) => {
  res.send(`Get user by ID: ${req.params.id}`);
};

const createUser = (req, res) => {
  res.send('Create user');
};

const updateUser = (req, res) => {
  res.send(`Update user by ID: ${req.params.id}`);
};

const deleteUser = (req, res) => {
  res.send(`Delete user by ID: ${req.params.id}`);
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
