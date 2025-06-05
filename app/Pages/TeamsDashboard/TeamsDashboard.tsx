import { useEffect, useState } from "react";
import { useTeamsContext } from "~/Contexts/Teams/TeamsContext";

export function TeamsDashboard() {
  const {
    paginatedTeams,
    allMembers,
    fetchTeams,
    fetchMembers,
    assignMemberToTeam,
    removeMemberFromTeam,
    setSortBy,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useTeamsContext();

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  useEffect(() => {
    fetchTeams();
    fetchMembers();
  }, []);

  if (!paginatedTeams.length) return <p>Chargement des équipes...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard des équipes</h1>

      {/* ----- Controles de tri ----- */}
      <div className="flex gap-4">
        <button onClick={() => setSortBy("title")} className="btn">Trier par nom</button>
        <button onClick={() => setSortBy("assignedMemberIds")} className="btn">Trier par nombre de membres</button>
      </div>

      {/* ----- Liste des équipes ----- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedTeams.map((team) => (
          <div key={team.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{team.title}</h2>
            <p className="text-gray-600">{team.body}</p>
            <p className="mt-2 text-sm font-medium">Membres assignés :</p>
            <ul className="text-sm">
              {team.assignedMemberIds.map((id) => {
                const member = allMembers.find((m) => m.id === id);
                return member ? <li key={id}>{member.name}</li> : null;
              })}
            </ul>
            <button
              onClick={() => setSelectedTeamId(team.id)}
              className="mt-2 btn btn-outline"
            >
              Gérer les membres
            </button>
          </div>
        ))}
      </div>

      {/* ----- Pagination ----- */}
      <div className="flex gap-2 mt-4">
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
        <span>Page {currentPage} / {totalPages}</span>
        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
      </div>

      {/* ----- Modale / Section assignation ----- */}
      {selectedTeamId && (
        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg font-bold">Gérer les membres de l’équipe #{selectedTeamId}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {allMembers.map((member) => {
              const isAssigned = paginatedTeams
                .find((t) => t.id === selectedTeamId)
                ?.assignedMemberIds.includes(member.id);
              return (
                <li key={member.id} className="flex items-center justify-between border p-2 rounded">
                  <span>{member.name}</span>
                  <button
                    className="btn"
                    onClick={() =>
                      isAssigned
                        ? removeMemberFromTeam(selectedTeamId, member.id)
                        : assignMemberToTeam(selectedTeamId, member.id)
                    }
                  >
                    {isAssigned ? "Désassigner" : "Assigner"}
                  </button>
                </li>
              );
            })}
          </ul>

          <button onClick={() => setSelectedTeamId(null)} className="mt-4 btn btn-error">
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
