import { Container, Space } from "@mantine/core";
import ServiceWrapper from "..";
import "../style.module.scss";
// cspell:ignore Luhansk

export default function ReferralProgram() {
  return (
    <Container>
      <Space my={"xl"} />
      <ServiceWrapper />
      <h1>Crypto Copy Invest Referral Program</h1>

      <h2>1. What is the Crypto Copy Invest Referral Program?</h2>
      <p>
        You can now invite your friends to Crypto Copy Invest and get
        a portion of their trading fees as a commission. You are
        entitled to two types of commissions rebates from your
        invitees based on your relationships. i) Direct Rebates -
        Users who sign up directly through your referral link. ii)
        Indirect Rebates - Users who sign up indirectly through the
        referral link from one of your direct referrals.
      </p>

      <h2>2. Users Relationships</h2>
      <p>
        User A invites B, B invites C, C invites D and so on.
        <br />
        To User A - B is the direct, C is the indirect
        <br />
        To User B - A is the introducer, C is the direct, D is the
        indirect
        <br />
        To User C - B is the introducer, D is the direct
        <br />
      </p>

      <h2>3. Referral Level & Commissions Ratio</h2>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>No. of Invitations</th>
            <th>Direct Rebate Ratio</th>
            <th>Indirect Rebate Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1-9</td>
            <td>16%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td>2</td>
            <td>10-49</td>
            <td>19%</td>
            <td>1%</td>
          </tr>
          <tr>
            <td>3</td>
            <td>50-99</td>
            <td>22%</td>
            <td>1%</td>
          </tr>
          <tr>
            <td>4</td>
            <td>100-149</td>
            <td>25%</td>
            <td>2%</td>
          </tr>
          <tr>
            <td>5</td>
            <td>150-199</td>
            <td>30%</td>
            <td>3%</td>
          </tr>
          <tr>
            <td>6</td>
            <td>{">200"}</td>
            <td>35%</td>
            <td>4%</td>
          </tr>
        </tbody>
      </table>
      <p>
        Scenario:
        <br />
        User A invites 5 people including B; B invites 170 people
        including C; and C invites 7 people including D. Based on the
        table above,
        <br /> A is level 1, direct commission rebate is 16%; indirect
        commission rebate is 0%
        <br />
        B is level 5, direct commission rebate is 30%; indirect
        commission rebate is 3%
        <br />
        C is level 1, direct commission rebate is 16%; indirect
        commission rebate is 0%
        <br />
      </p>
      <h2>4. Actual Commissions Earning Illustrations</h2>
      <p>
        Assume that the trading fee incurred by B is $100, the trading
        fee incurred by C is $100, and the transaction fee incurred by
        D is $100.
        <br />
        User A
        <br />
        For A, as the introducer of B, will receive direct rebate from
        trading fees incurred by B.
        <br />
        Direct Rebate from B: $100 * 16% = $16
        <br />
        As A is at Level 1, he is not entitled to the indirect rebate,
        hence he will not receive indirect rebate.
      </p>
      <br />
      <p>
        User B<br />
        For B, as the introducer of C, will receive direct rebate from
        trading fees incurred by C.
        <br />
        Direct Rebate from C: $100 * 30% = $30
        <br />
        At the same time, B, as the indirect introducer of D, will
        also receive indirect rebate from trading fees of D<br />
        Indirect Rebate from D: $100 * 3% = $3
      </p>
      <br />
      <p>
        User C<br />
        For C, as the introducer of D, will receive direct rebate from
        trading fees incurred by D.
        <br />
        Direct rebate: $100 * 16% = $16
        <br />
        As C is at Level 1, he is not entitled to the indirect rebate,
        hence he will not receive indirect rebate.
        <br />
      </p>
      <h2>
        5. Crypto Copy Invest Promotional Referral Program (Limited
        Time)
      </h2>
      <p>
        As an appreciation to all our early partners, OM is delighted
        to introduce a special referral program to all users who sign
        up with us in this promotional period. The rebate structure
        will remain for early partners regardless of any changes in
        the future.
      </p>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>No. of Invitations</th>
            <th>Direct Rebate Ratio</th>
            <th>Indirect Rebate Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1-9</td>
            <td>
              <s>16%</s> 20%
            </td>
            <td>0%</td>
          </tr>
          <tr>
            <td>2</td>
            <td>10-49</td>
            <td>
              <s>19%</s> 24%
            </td>
            <td>
              <s>1%</s> 2%
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>50-99</td>
            <td>
              <s>22%</s> 28%
            </td>
            <td>
              <s>1%</s> 2%
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>100-149</td>
            <td>
              <s>25%</s> 32%
            </td>
            <td>
              <s>2%</s> 3%
            </td>
          </tr>
          <tr>
            <td>5</td>
            <td>150-199</td>
            <td>
              <s>30%</s> 36%
            </td>
            <td>
              <s>3%</s> 4%
            </td>
          </tr>
          <tr>
            <td>6</td>
            <td>{">200"}</td>
            <td>
              <s>35%</s> 40%
            </td>
            <td>
              <s>4%</s> 6%
            </td>
          </tr>
          <tr>
            <td>VIP</td>
            <td>By invitation only</td>
            <td>{">40%"}</td>
            <td>{">6%"}</td>
          </tr>
        </tbody>
      </table>
      <h2>6. VIP Partner Program</h2>
      <p>
        Please reach out to our BD team should you think that you are
        capable of bringing more values and are interested in forming
        more formidable collaborations with Crypto Copy Invest. <br />
        We will support you from various perspectives which include
        but are not limited to online marketing campaigns, offline
        events, AMA, special bonuses, etc.
        <br />
        Welcome to ping our dedicated BD Team.
      </p>
      <Space my={"xl"} />
    </Container>
  );
}
