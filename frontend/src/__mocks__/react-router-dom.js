export const MemoryRouter = ({ children }) => children;
export const useNavigate = () => () => {};
export const BrowserRouter = ({ children }) => children;
export const Routes = ({ children }) => children;
export const Route = () => null;
export const Link = ({ children, to, ...props }) => {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
};
export const useParams = () => ({});
