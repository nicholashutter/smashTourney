namespace Services;

using Entities;

public interface IUserRepository
{
    Task<User?> GetUserByIdAsync(Guid id);
    Task<IEnumerable<User>?> GetAllUsersAsync();
    Task<bool> CreateUserAsync(User newUser);
    Task<bool> UpdateUserAsync(User updateUser);
    Task<bool> DeleteUserAsync(Guid id);

}