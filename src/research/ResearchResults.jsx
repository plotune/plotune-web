import { Navigate, useLocation } from 'react-router-dom';

const ResearchResults = () => {
  const location = useLocation();
  return <Navigate to={`/research${location.search}`} replace />;
};
export default ResearchResults;
