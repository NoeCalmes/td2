import { createContext, useContext, useEffect, useState } from "react";


export type Member = {
  id: number;
  name: string;
  email: string;
};

export type Team = {
  id: number;
  title: string;
  body: string;
  assignedMemberIds: number[];
};

type SortKey = keyof Team;

type TeamsContextType = {
  allTeams: Team[];
  paginatedTeams: Team[];
  allMembers: Member[];
  fetchTeams: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  assignMemberToTeam: (teamId: number, memberId: number) => void;
  removeMemberFromTeam: (teamId: number, memberId: number) => void;
  setSortBy: (key: SortKey) => void;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  currentPage: number;
};


const TeamsContext = createContext<TeamsContextType | null>(null);
export const useTeamsContext = () => useContext(TeamsContext)!;

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("title");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;


  const fetchTeams = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    const teamsWithMembers = data.map((team: any) => ({
      id: team.id,
      title: team.title,
      body: team.body,
      assignedMemberIds: [],
    }));
    setAllTeams(teamsWithMembers);
  };


  const fetchMembers = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    setAllMembers(data);
  };


  const assignMemberToTeam = (teamId: number, memberId: number) => {
    setAllTeams(prev =>
      prev.map(team =>
        team.id === teamId && !team.assignedMemberIds.includes(memberId)
          ? { ...team, assignedMemberIds: [...team.assignedMemberIds, memberId] }
          : team
      )
    );
  };


  const removeMemberFromTeam = (teamId: number, memberId: number) => {
    setAllTeams(prev =>
      prev.map(team =>
        team.id === teamId
          ? {
              ...team,
              assignedMemberIds: team.assignedMemberIds.filter(id => id !== memberId),
            }
          : team
      )
    );
  };


  const sortedTeams = [...allTeams].sort((a, b) =>
    a[sortBy] > b[sortBy] ? 1 : -1
  );


  const totalPages = Math.ceil(sortedTeams.length / pageSize);
  const paginatedTeams = sortedTeams.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  useEffect(() => {
    fetchTeams();
    fetchMembers();
  }, []);

  return (
    <TeamsContext.Provider
      value={{
        allTeams,
        paginatedTeams,
        allMembers,
        fetchTeams,
        fetchMembers,
        assignMemberToTeam,
        removeMemberFromTeam,
        setSortBy,
        setCurrentPage,
        pageSize,
        totalPages,
        currentPage,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
}
