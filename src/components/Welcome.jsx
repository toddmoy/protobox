export const Welcome = ({ name }) => (
  <h1 className="pb-center-items h-screen underline font-bold text-2xl font-sans center">
    👋🏽 {name}!
  </h1>
)

Welcome.propTypes = {
  name: String,
}
