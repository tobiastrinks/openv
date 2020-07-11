require "language/node"

class openv < Formula
  desc "Command Line Interface to set terminal session environment variables from 1Password secret notes"
  homepage "https://github.com/tobiastrinks/openv#readme"
  url "https://registry.npmjs.org/@ttrinks/openv/-/openv-1.0.0.tgz"
  version "1.0.0"
  sha256 "876ba5d9937d83aa31b23521f83c15e9d3d5fc67d264be04312090a393d1db23"

  depends_on "node"
  depends_on "1password-cli"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    raise "Test not implemented."
  end
end
