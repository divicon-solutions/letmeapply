import Board from '@/components/Board';
import NavWrapper from '@/components/NavWrapper';
import { ClerkProvider } from '@clerk/nextjs';

const BoardPage = () => {
  return (
    <ClerkProvider>
      <NavWrapper>
        <Board />
      </NavWrapper>
    </ClerkProvider>
  );
};

export default BoardPage;
