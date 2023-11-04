export default function findTeamates() {
  return (
    <div
      className="parent"
      style={{
        // height: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(150px, 25%) 1fr",
      }}
    >
      {/* sidebar */}
      <div className="flex flex-col bg-gray-500 p-2">
        <div>
          <button>Find Teammates</button>
        </div>
      </div>

      {/* right content */}
      <div>asdf</div>
    </div>
  );
}
