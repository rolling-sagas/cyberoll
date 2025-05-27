import { GoIosAppBtn } from '../common/get-ios-app';
import Logo from './logo';
import More from './more';

export default function MHeader({ className = '' }) {
  return (
    <div className="w-full sm:hidden h-12 flex-none flex justify-between items-center bg-rs-background-2">
      <More />
      <Logo size={30} />
      <div className="right w-16">
        <GoIosAppBtn />
      </div>
    </div>
  );
}
