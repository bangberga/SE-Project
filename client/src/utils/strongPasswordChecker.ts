export default function strongPasswordChecker(
  password: string
): "STRONG" | "MEDIUM" | "WEAK" {
  const strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  const mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  );
  if (strongPassword.test(password)) return "STRONG";
  if (mediumPassword.test(password)) return "MEDIUM";
  return "WEAK";
}
