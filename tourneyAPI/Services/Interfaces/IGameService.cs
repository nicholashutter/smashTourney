namespace Services;

using System.Security;
using Entities;
using Microsoft.Extensions.Configuration.UserSecrets;

public interface IGameService
{
    Task<Guid?> CreateNewGameAsync(Game newGame);
    Task<Game?> GetGameByIdAsync(Guid Id);
    Task<IEnumerable<Game>?> GetAllGamesAsync();
    bool UsersToPlayersAsync(List<Player> players);

    bool AddUserToGame(User addUser, Guid gameId);

    Task<bool> StartGameAsync(Game game);
    Task<bool> StartRoundAsync(Game game);
    Task<bool> EndRoundAsync(Game game);
    Task<bool> EndGameAsync(Game game);
    Task<bool> SaveGameAsync(Game game);
    Task<bool> LoadGameAsync(Game game);
    Task<bool> VoteHandlerAsync(Guid playerID, Guid playerToVoteForID);

}