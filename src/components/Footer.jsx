export default function Footer() {
  return (
    <>
      <div className="absolute inset-x-0 bottom-0">
        <div className="h-[1px] bg-[#3A3A3C]" />
        <footer className="bg-gray py-6">
          <div className="grid grid-cols-3 gap-4 container mx-auto text-left text-dark-gray mb-10">
            <div>
              <div className="flex flex-col items-center">
                <p className="mb-5 text-bold text-lg">Shop</p>
                <p className="mb-3 text-bold">Shop 1</p>
                <p className="mb-3 text-bold">Shop 2</p>
                <p className="mb-3 text-bold">Shop 3</p>
                <p className="mb-3 text-bold">Shop 4</p>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <p className="mb-5 text-bold text-lg">Useful Links</p>
                <p className="mb-3 text-bold">Useful Links 1</p>
                <p className="mb-3 text-bold">Useful Links 2</p>
                <p className="mb-3 text-bold">Useful Links 3</p>
                <p className="mb-3 text-bold">Useful Links 4</p>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <p className="mb-5 text-bold text-lg">Contact us</p>
                <p className="mb-3 text-bold">Contact us 1</p>
                <p className="mb-3 text-bold">Contact us 2</p>
                <p className="mb-3 text-bold">Contact us 3</p>
                <p className="mb-3 text-bold">Contact us 4</p>
              </div>
            </div>
          </div>
          <div className=" absolute inset-x-0 bottom-0  text-center text-gray h-6 bg-dark-gray">
            © 2025 Luna — All Rights Reserved
          </div>
        </footer>
      </div>
    </>

  );
}